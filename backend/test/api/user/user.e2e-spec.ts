import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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

let mockUserRestProperty: {
  id: string;
  username: string;
  createdAt: string;
}[] = [];
describe('UserController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get(getConnectionToken());
    const users = await prepareDbBeforeEachTest(connection);

    users.forEach((user: UserEntity) => {
      mockUserRestProperty.push({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
      });
    });
  });

  it('api/user/:username (GET)', async () => {
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

  afterAll(async () => {
    await cleanupDbAfterEachTest(connection);
    // await app.close()
  });
});
