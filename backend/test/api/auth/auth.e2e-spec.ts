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
} from '../user/db.prepare';
import { UserEntity } from 'src/user/entities/user.entity';

let mockUserRestProperty: {
  id: string;
  username: string;
  createdAt: string;
}[] = [];
describe('AuthController (e2e)', () => {
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

  it('api/auth/login (POST) should return access_token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: mockCreateUsers[0].username,
        password: mockCreateUsers[0].password,
      })
      .expect(200);

    expect(response.body.status).toEqual(200);
    expect(response.body.message).toEqual('User logged');
    const token = response.body.data.access_token;
    expect(token).toBeDefined();
  });

  afterAll(async () => {
    await cleanupDbAfterEachTest(connection);
    // await app.close()
  });
});

// import { INestApplication } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import { getConnectionToken } from '@nestjs/typeorm';
// import { Connection, Repository } from 'typeorm';
// import * as request from 'supertest';

// import {
//   cleanupDbAfterEachTest,
//   mockCreateUsers,
//   prepareDbBeforeEachTest,
// } from '../user/db.prepare';
// import { AppModule } from '../../../src/app.module';
// import { UserService } from '../../../src/user/services/user.service';
// import { JwtService } from '@nestjs/jwt';

// describe('AuthController (e2e)', () => {
//   let app: INestApplication;
//   let connection: Connection;

//   process.env['JWT_SECRET'] = 'secret';
//   process.env['JWT_EXPIRED_IN'] = '60s';

// //   console.log(process.env.JWT_SECRET);

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//       providers: [UserService, JwtService, Repository],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();

//     connection = moduleFixture.get(getConnectionToken());
//     const users = await prepareDbBeforeEachTest(connection);
//   });

//   it('api/auth/login (POST) should return access_token', async () => {
//     const response = await request(app.getHttpServer())
//       .post('/api/auth/login')
//       .send({
//         username: mockCreateUsers[0].username,
//         password: mockCreateUsers[0].password,
//       })
//       .expect(200);
//   });

//   afterAll(async () => {
//     await cleanupDbAfterEachTest(connection);
//     // await app.close()
//   });
// });
