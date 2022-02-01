import { ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import supertest, * as request from 'supertest';
import slugify from 'slugify';

import { AppModule } from '../../../src/app.module';
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard';
import {
  cleanupDbAfterEachTest,
  mockCreateUsers,
  prepareDbBeforeEachTest,
} from '../user/db.prepare';
import { mockCreateBlogs, prepareDbBlogBeforeTest } from './blog.db.prepare';
import { PresenterOutput } from '../../../src/core/presenter';
import { BlogEntity } from '../../../src/blog/entities/blog.entity';
import { UserEntity } from '../../../src/user/entities/user.entity';

describe('BlogController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let users: UserEntity[] = [];
  let blogs: BlogEntity[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          // console.log(request.headers);

          request.user = { username: request.headers.username };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get(getConnectionToken());
    users = await prepareDbBeforeEachTest(connection);
    blogs = await prepareDbBlogBeforeTest(connection);
  });

  it('api/blog (GET) should get all blogs from current logged user', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/blog')
      .set({ username: mockCreateUsers[0].username })
      .expect(HttpStatus.OK);

    const respData = response.body.data as Array<BlogEntity>;
    expect(response.body.message).toEqual('Blogs found');
    expect(response.body.data).toBeInstanceOf(Array);
    expect(respData.length).toEqual(3);
    expect(respData[0].author.username).toEqual(mockCreateUsers[0].username);
  });

  it('api/blog (GET) should get error Current user does not have blog article yet', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/blog')
      .set({ username: mockCreateUsers[2].username })
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body.message).toEqual(
      'Current user does not have blog article yet',
    );
    expect(response.body.data).toEqual({});
  });

  it('api/blog/slug (GET) should get blog by slug from current logged user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/blog/${blogs[0].slug}`)
      .set({ username: mockCreateUsers[0].username })
      .expect(HttpStatus.OK);

    const respData = response.body.data;
    expect(respData.author.username).toEqual(mockCreateUsers[0].username);
    expect(respData.title).toEqual(blogs[0].title);

    expect(response.body.message).toEqual('Blog found');
  });

  it('api/blog/slug (GET) should get error Access forbidden for this user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/blog/${blogs[0].slug}`)
      .set({ username: mockCreateUsers[2].username })
      .expect(HttpStatus.FORBIDDEN);

    expect(response.body.message).toEqual('Access forbidden for this user');
    expect(response.body.data).toEqual({});
  });

  it('api/blog (POST) should be return http status 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/blog')
      .set({ username: mockCreateUsers[2].username })
      .send(mockCreateBlogs[1])
      .expect(HttpStatus.CREATED);

    const respData = response.body.data;
    let expectedData = mockCreateBlogs[1];
    let { author, createdAt, id, slug, updatedAt, ...restData } = respData;
    const expectedmessage = 'Blog created';
    const expectedUsername = mockCreateUsers[2].username;

    delete expectedData.content;
    delete restData.content;
    expect(response.body.message).toEqual(expectedmessage);
    expect(respData.author.username).toEqual(expectedUsername);
    expect(restData).toEqual(expectedData);
    expect(slug).toEqual(slugify(expectedData.title));
  });

  it('api/blog (POST) should get error Blog title already exists', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/blog')
      .set({ username: mockCreateUsers[2].username })
      .send(mockCreateBlogs[2])
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.message).toEqual('Blog title already exists');
    expect(response.body.data).toEqual({});
  });

  it('api/blog (PUT) should be return http status 200', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/blog')
      .set({ username: mockCreateUsers[0].username })
      .send({ ...mockCreateBlogs[3], id: blogs[0].id })
      .expect(HttpStatus.OK);

    const id = response.body.data.id;
    const expectedmessage = 'Blog updated';

    expect(response.body.message).toEqual(expectedmessage);
    expect(id).toEqual(blogs[0].id);
  });

  it('api/blog (PUT) should be return Blog with current title not found', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/blog')
      .set({ username: mockCreateUsers[0].username })
      .send({
        ...mockCreateBlogs[3],
        id: '277eaba0-7def-4cef-b9fa-f8e8c6ac39a0',
      })
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body.message).toEqual('Blog with current title not found');
    expect(response.body.data).toEqual({});
  });

  it('api/blog (PUT) should be return Access forbidden for this user', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/blog')
      .set({ username: mockCreateUsers[2].username })
      .send({ ...mockCreateBlogs[3], id: blogs[0].id })
      .expect(HttpStatus.FORBIDDEN);

    expect(response.body.message).toEqual('Access forbidden for this user');
    expect(response.body.data).toEqual({});
  });

  it('api/blog/id (DELETE) should be return http status 200', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/blog/${blogs[0].id}`)
      .set({ username: mockCreateUsers[0].username })
      .expect(HttpStatus.OK);

    const respData = response.body.data;
    const expectedmessage = 'Blog deleted';

    expect(response.body.message).toEqual(expectedmessage);
    expect(respData.title).toEqual(blogs[2].title);
  });

  it('api/blog/id (DELETE) should be return Blog with current id not found', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/blog/${blogs[0].id}`)
      .set({ username: mockCreateUsers[0].username })
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body.message).toEqual('Blog with current id not found');
    expect(response.body.data).toEqual({});
  });

  it('api/blog/id (DELETE) should be return Access forbidden for this user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/blog/${blogs[2].id}`)
      .set({ username: mockCreateUsers[2].username })
      .expect(HttpStatus.FORBIDDEN);

    expect(response.body.message).toEqual('Access forbidden for this user');
    expect(response.body.data).toEqual({});
  });

  afterAll(async () => {
    await cleanupDbAfterEachTest(connection);
  });
});
