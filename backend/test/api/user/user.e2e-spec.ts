import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { Connection } from 'typeorm';
import { getConnectionToken } from '@nestjs/typeorm';

import {
  prepareDbBeforeEachTest,
  cleanupDbAfterEachTest,
  mockCreateUsers,
} from './db.prepare';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard';
import { Role } from '../../../src/auth/roles.enum';
import { RoleGuard } from '../../../src/auth/guards/role.guard';

let mockUserRestProperty: {
  id: string;
  username: string;
  createdAt: string;
  role: Role;
}[] = [];

jest.setTimeout(60000);

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (contex: ExecutionContext) => {
          return true;
        },
      })
      .overrideGuard(RoleGuard)
      .useValue({
        canActivate: (contex: ExecutionContext) => {
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get(getConnectionToken());
    const users = await prepareDbBeforeEachTest(connection);

    users.forEach((user: UserEntity) => {
      mockUserRestProperty.push({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
        role: user.role,
      });
    });
  });

  it('api/user/register (POST) should be return http status 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/user/register')
      .send(mockCreateUsers[1])
      .expect(201);

    const testUser1ExcPass = mockCreateUsers[1];
    delete testUser1ExcPass.password;
    const out = response.body;
    const { createdAt, role, id, ...createdData } = out.data;

    // console.log('Test-User-Service-createUser actual out', out);
    expect(out.status).toEqual(201);
    expect(out.message).toEqual('User Created');
    expect(createdData).toEqual(testUser1ExcPass);
    expect(role).toEqual(Role.USER);
    expect(out.data).not.toContain('password');
    expect(id).not.toEqual('');
    expect(createdAt).not.toEqual('');
  });

  it('api/user/register (POST) should get message user already exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/user/register')
      .send({
        username: 'test-user1',
        email: 'test1@yahoo.com',
        password: '123456',
        fullname: 'Test User 1',
        image_url: 'http://www.test.user1',
      })
      .expect(400);

    const respData = response.body;
    const expRespData = {
      status: 400,
      message: 'User already exist',
      data: {},
    };

    expect(respData).toEqual(expRespData);
  });

  it('api/user/ (GET) should get all user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/user`)
      .expect(200);

    const data = response.body.data;
    const filteredUsers = data.filter(
      (user: any) =>
        user.username === 'test-user' || user.username === 'test-user1',
    );
    expect(data).toBeInstanceOf(Array);
    expect(response.body.status).toEqual(200);
    expect(response.body.message).toEqual('');
    expect((data as Array<UserEntity>).length).toBeGreaterThanOrEqual(2);
    // console.log('mockCreateUsers', mockCreateUsers);
    filteredUsers.forEach((user: any) => {
      const findData = mockCreateUsers.find(
        (userMock) => user.username === userMock.username,
      );
      // console.log('findData', findData);
      // console.log('user', user);
      expect(findData).not.toBeUndefined();
    });
  });

  it('api/user/:username (GET) should get one user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/user/${mockCreateUsers[0].username}`)
      .expect(200);

    const respData = response.body;
    const dataRest = mockUserRestProperty.find(
      (user) => user.username === mockUserRestProperty[0].username,
    );
    const dataUser = { ...dataRest, ...mockCreateUsers[0] };
    delete dataUser.password;
    const expRespData = {
      status: 200,
      message: 'User Found',
      data: dataUser,
    };

    expect(expRespData).toEqual(respData);
    // console.log(respData);
    // console.log(expRespData);
  });

  it('api/user/:username (GET) should get not found error', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/user/username`)
      .expect(404);

    const respData = response.body;
    const expRespData = {
      status: 404,
      message: 'User not found',
      data: {},
    };

    expect(expRespData).toEqual(respData);
  });

  it('api/user/:username (DELETE) should delete one user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/user/${mockCreateUsers[2].username}`)
      .expect(200);

    const respData = response.body;
    const expRespData = {
      status: 200,
      message: 'User deleted',
      data: { username: mockCreateUsers[2].username },
    };

    expect(expRespData).toEqual(respData);
    // console.log(respData);
    // console.log(expRespData);
  });

  it('api/user/:username (DELETE) should get not found error', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/user/username`)
      .expect(404);

    const respData = response.body;
    const expRespData = {
      status: 404,
      message: 'User not found',
      data: {},
    };

    expect(expRespData).toEqual(respData);
  });

  afterAll(async () => {
    await cleanupDbAfterEachTest(connection);
    // await app.close()
  });
});
