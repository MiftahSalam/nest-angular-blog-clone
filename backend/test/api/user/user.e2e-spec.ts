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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get(getConnectionToken());
    await prepareDbBeforeEachTest(connection);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Angular-Nestjs Blog!');
  });

  afterAll(async () => {
    await cleanupDbAfterEachTest(connection);
    // console.log('user e2e afterAll');
  });
});
