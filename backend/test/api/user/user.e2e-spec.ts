import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { Connection } from 'typeorm';
import { getConnectionToken } from '@nestjs/typeorm';

import { prepareDbBeforeEachTest, cleanupDbAfterEachTest } from './db.prepare';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  //   let testUser: CreateUserDto = {
  //     username: 'test-user',
  //     email: 'test@yahoo.com',
  //     password: '123456',
  //     fullname: 'Test User',
  //     image_url: 'http://www.test.user',
  //   };
  //   let testUser1: CreateUserDto = {
  //     username: 'test-user1',
  //     email: 'test1@yahoo.com',
  //     password: '123456',
  //     fullname: 'Test User 1',
  //     image_url: 'http://www.test.user1',
  //   };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get(getConnectionToken());
    prepareDbBeforeEachTest(connection);
    // await connection
    //   .createQueryBuilder(UserEntity, 'users')
    //   .insert()
    //   .into(UserEntity)
    //   .values([
    //     {
    //       username: testUser.username,
    //       email: testUser.email,
    //       password: testUser.password,
    //       fullname: testUser.fullname,
    //       image_url: testUser.image_url,
    //     },
    //   ])
    //   .execute();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Angular-Nestjs Blog!');
  });

  afterEach(async () => {
    await cleanupDbAfterEachTest(connection);
    // await connection
    //   .createQueryBuilder(UserEntity, 'users')
    //   .delete()
    //   .from(UserEntity)
    //   .where('username = :username', { username: testUser.username })
    //   .execute();
    // await connection
    //   .createQueryBuilder(UserEntity, 'users')
    //   .delete()
    //   .from(UserEntity)
    //   .where('username = :username', { username: testUser1.username })
    //   .execute();
    // await connection.close();
  });
});
