import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import slugify from 'slugify';

import {
  mockCreateBlogs,
  // cleanupDbBlogAfterTest,
  prepareDbBlogBeforeTest,
} from '../../../test/api/blog/blog.db.prepare';
import { BlogEntity } from '../entities/blog.entity';

import { BlogService } from './blog.service';
import { UserService } from '../../../src/user/services/user.service';
import { UserEntity } from '../../../src/user/entities/user.entity';
import {
  cleanupDbAfterEachTest,
  mockCreateUsers,
  prepareDbBeforeEachTest,
} from '../../../test/api/user/db.prepare';
import { PresenterOutput } from '../../core/presenter';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

const ormconfig = require('../../config/ormconfig');

describe('BlogService', () => {
  let service: BlogService;
  let connection: Connection;
  let blogListId: string[] = [];
  let blogDelete: BlogEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormconfig[0]),
        TypeOrmModule.forFeature([BlogEntity, UserEntity]),
      ],
      providers: [BlogService, UserService],
    }).compile();

    service = module.get<BlogService>(BlogService);
    connection = await module.get(getConnectionToken());
    await prepareDbBeforeEachTest(connection);
    await prepareDbBlogBeforeTest(connection);

    const repo = connection.getRepository(BlogEntity);
    blogDelete = await repo.findOne({
      title: mockCreateBlogs[0].title,
    });
    blogListId.push(blogDelete.id);
    blogDelete = await repo.findOne({
      title: mockCreateBlogs[3].title,
    });

    blogListId.push(blogDelete.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAllBlog -> should get blogs of all author', (done: jest.DoneCallback) => {
    service.findAllBlogs().subscribe({
      next: (out: PresenterOutput) => {
        // console.log(out);

        expect(out.data).toBeInstanceOf(Array);
        expect(out.status).toEqual(HttpStatus.OK);
        expect(out.message).toEqual('');

        done();
      },
      error: (err) => {
        done.fail('should get blogs');
      },
    });
  });

  it('findAllBlogByUser -> should get blogs of related author', (done: jest.DoneCallback) => {
    service.findAllBlogByUser(mockCreateUsers[0].username).subscribe({
      next: (out: PresenterOutput) => {
        const data = out.data as Array<BlogEntity>;
        expect(out.data).toBeInstanceOf(Array);
        expect(out.status).toEqual(HttpStatus.OK);
        expect(out.message).toEqual('Blogs found');
        expect((out.data as Array<UserEntity>).length).toBeGreaterThanOrEqual(
          2,
        );
        expect(data[0].author.username).toEqual(mockCreateUsers[0].username);

        done();
      },
      error: (err) => {
        done.fail('should get blogs');
      },
    });
  });

  it('findAllBlogByUser -> should be get error Current user does not have blog article yet', (done: jest.DoneCallback) => {
    service.findAllBlogByUser(mockCreateUsers[2].username).subscribe({
      next: () => {
        done.fail('Blog should not found');
      },
      error: (err) => {
        if (err instanceof NotFoundException) {
          expect(err.message).toEqual(
            'Current user does not have blog article yet',
          );
          done();
        } else done.fail('Error is not NotFoundException');
      },
    });
  });

  xtest('findAllBlogByUser -> should be get error Access forbidden for this user', (done: jest.DoneCallback) => {
    service.findAllBlogByUser(mockCreateUsers[2].username).subscribe({
      next: () => {
        done.fail('Blog should not found');
      },
      error: (err) => {
        if (err instanceof ForbiddenException) {
          expect(err.message).toEqual('Access forbidden for this user');
          done();
        } else done.fail('Error is not ForbiddenException');
      },
    });
  });

  it('findBlogBySlug -> should get one blog with author', (done: jest.DoneCallback) => {
    service
      .findBlogBySlug(
        slugify(mockCreateBlogs[0].title),
        mockCreateUsers[0].username,
      )
      .subscribe((out: PresenterOutput) => {
        expect(out.data.author.username).toEqual(mockCreateUsers[0].username);
        expect(out.data.title).toEqual(mockCreateBlogs[0].title);
        expect(out.data.slug).toEqual(slugify(mockCreateBlogs[0].title));
        expect(out.data).toHaveProperty('id');
      });

    done();
  });

  it('findBlogBySlug -> should be get error Blog with current title not found', (done: jest.DoneCallback) => {
    service
      .findBlogBySlug(
        slugify('mockCreateBlogs title'),
        mockCreateUsers[0].username,
      )
      .subscribe({
        next: () => {
          done.fail('Blog should not found');
        },
        error: (err) => {
          if (err instanceof NotFoundException) {
            expect(err.message).toEqual('Blog with current title not found');
            done();
          } else done.fail('Error is not NotFoundException');
        },
      });
  });

  it('findBlogBySlug -> should be get error Access forbidden for this user', (done: jest.DoneCallback) => {
    service
      .findBlogBySlug(
        slugify(mockCreateBlogs[0].title),
        mockCreateUsers[2].username,
      )
      .subscribe({
        next: () => {
          done.fail('Blog should not found');
        },
        error: (err) => {
          if (err instanceof ForbiddenException) {
            expect(err.message).toEqual('Access forbidden for this user');
            done();
          } else done.fail('Error is not ForbiddenException');
        },
      });
  });

  it('createBlog -> should be create one blog', (done: jest.DoneCallback) => {
    service
      .createBlog(mockCreateBlogs[1], mockCreateUsers[0].username)
      .subscribe({
        next: (out: PresenterOutput) => {
          let expectedData = mockCreateBlogs[1];
          let { author, createdAt, id, slug, updatedAt, ...restData } =
            out.data;
          const expectedStatus = HttpStatus.OK;
          const expectedmessage = 'Blog created';
          const expectedUsername = mockCreateUsers[0].username;

          delete expectedData.content;
          delete restData.content;
          expect(out.status).toEqual(expectedStatus);
          expect(out.message).toEqual(expectedmessage);
          expect(author.username).toEqual(expectedUsername);
          expect(restData).toEqual(expectedData);
          expect(slug).toEqual(slugify(expectedData.title));

          // console.log('Test createBlog expectedData', expectedData);
          // console.log('Test createBlog out', out);

          done();
        },
        error: (err) => {
          console.error('Test failed with error', err);
          done.fail('create blog fail');
        },
      });
  });

  it('createBlog -> should be get error Blog title already exists', (done: jest.DoneCallback) => {
    service
      .createBlog(mockCreateBlogs[1], mockCreateUsers[0].username)
      .subscribe({
        next: () => {
          done.fail('Blog should not created');
        },
        error: (err) => {
          if (err instanceof BadRequestException) {
            expect(err.message).toEqual('Blog title already exists');
            done();
          } else done.fail('Error is not BadRequestException');
        },
      });
  });

  it('updateBlog -> should be update one blog', (done: jest.DoneCallback) => {
    // console.log('Test updateBlog blogListId', blogListId);
    service
      .updateBlog(
        { ...mockCreateBlogs[0], id: blogListId[0] },
        mockCreateUsers[0].username,
      )
      .subscribe({
        next: (out: PresenterOutput) => {
          let expectedData = mockCreateBlogs[0];
          const id = out.data.id;
          const expectedStatus = HttpStatus.OK;
          const expectedmessage = 'Blog updated';

          delete expectedData.content;

          expect(out.status).toEqual(expectedStatus);
          expect(out.message).toEqual(expectedmessage);
          expect(id).toEqual(blogListId[0]);

          // console.log('Test createBlog expectedData', expectedData);
          // console.log('Test createBlog out', out);

          done();
        },
        error: (err) => {
          console.error('Test failed with error', err);
          done.fail('create blog fail');
        },
      });
  });

  it('updateBlog -> should be get error Blog with current title not found', (done: jest.DoneCallback) => {
    service
      .updateBlog(
        {
          title: 'dfdfsdfsdf',
          description: 'sdfsdfsdf',
          image_url: 'sdfsdfsdf',
          id: '277eaba0-7def-4cef-b9fa-f8e8c6ac39a0',
          content: 'dfsdfsdf',
        },
        mockCreateUsers[0].username,
      )
      .subscribe({
        next: () => {
          done.fail('Blog should not found');
        },
        error: (err) => {
          // console.error(err);

          if (err instanceof NotFoundException) {
            expect(err.message).toEqual('Blog with current title not found');
            done();
          } else done.fail('Error is not NotFoundException');
        },
      });
  });

  it('updateBlog -> should be get error Access forbidden for this user', (done: jest.DoneCallback) => {
    service
      .updateBlog(
        { ...mockCreateBlogs[1], id: blogListId[0] },
        mockCreateUsers[1].username,
      )
      .subscribe({
        next: () => {
          done.fail('Blog should not found');
        },
        error: (err) => {
          if (err instanceof ForbiddenException) {
            expect(err.message).toEqual('Access forbidden for this user');
            done();
          } else done.fail('Error is not ForbiddenException');
        },
      });
  });

  it('deleteBlog -> should be delete one user', (done: jest.DoneCallback) => {
    console.log('Test deleteBlog blogListId[0]', blogListId[0]);
    service.deleteBlog(blogListId[0], mockCreateUsers[0].username).subscribe({
      next: (out: PresenterOutput) => {
        const presenter: PresenterOutput = {
          status: HttpStatus.OK,
          message: 'Blog deleted',
          data: { title: mockCreateBlogs[0].title },
        };
        expect(out).toEqual(presenter);
        done();
      },
      error: (err) => {
        console.error('Test failed with error', err);
        done.fail('delete user fail');
      },
    });
  });

  it('deleteBlog -> should be get error Blog with current title not found', (done: jest.DoneCallback) => {
    service
      .deleteBlog(
        '277eaba0-7def-4cef-b9fa-f8e8c6ac39a0',
        mockCreateUsers[0].username,
      )
      .subscribe({
        next: () => {
          done.fail('Blog should not found');
        },
        error: (err) => {
          // console.error(err);

          if (err instanceof NotFoundException) {
            expect(err.message).toEqual('Blog with current id not found');
            done();
          } else done.fail('Error is not NotFoundException');
        },
      });
  });

  it('deleteBlog -> should be get error Access forbidden for this user', (done: jest.DoneCallback) => {
    service.deleteBlog(blogListId[1], mockCreateUsers[1].username).subscribe({
      next: () => {
        done.fail('Blog should not found');
      },
      error: (err) => {
        if (err instanceof ForbiddenException) {
          expect(err.message).toEqual('Access forbidden for this user');
          done();
        } else done.fail('Error is not ForbiddenException');
      },
    });
  });

  afterAll(async () => {
    // await cleanupDbBlogAfterTest(connection);
    await cleanupDbAfterEachTest(connection);
  });
});
