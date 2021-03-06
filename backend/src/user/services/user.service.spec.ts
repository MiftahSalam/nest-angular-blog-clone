import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PresenterOutput } from 'src/core/presenter';
import { UserEntity } from '../entities/user.entity';
import { UserService } from './user.service';
import ormconfig = require('../../config/ormconfig');

import {
  mockCreateUsers,
  prepareDbBeforeEachTest,
  cleanupDbAfterEachTest,
} from '../../../test/api/user/db.prepare';
import { from } from 'rxjs';

jest.setTimeout(10000);

describe('UserService', () => {
  let service: UserService;
  let connection: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormconfig[0]),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [UserService, Repository],
    }).compile();

    service = module.get<UserService>(UserService);
    connection = await module.get(getConnectionToken());
    await prepareDbBeforeEachTest(connection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validateUser -> should get password', async () => {
    const user = await service.validateUser(
      mockCreateUsers[0].username,
      mockCreateUsers[0].password,
    );

    expect(user).toBeTruthy();
  });

  it('validateUser -> should be throw error invalid credential', (done: jest.DoneCallback) => {
    from(
      service.validateUser(mockCreateUsers[0].username, 'testUser.username'),
    ).subscribe({
      next: () => {
        done.fail('should get error invalid credential');
      },
      error: (err) => {
        if (err instanceof UnauthorizedException) {
          expect(err.message).toEqual('Invalid credential');
          done();
        } else done.fail('Error is not UnauthorizedException');
      },
    });
  });

  it('findAll -> should be get all users', (done: jest.DoneCallback) => {
    service.findAll().subscribe((out: PresenterOutput) => {
      const data = out.data as Array<UserEntity>;
      const filteredUsers = data.filter(
        (user) =>
          user.username === 'test-user' || user.username === 'test-user1',
      );
      expect(out.data).toBeInstanceOf(Array);
      expect(out.status).toEqual(HttpStatus.OK);
      expect(out.message).toEqual('');
      expect((out.data as Array<UserEntity>).length).toBeGreaterThanOrEqual(2);
      // console.log('mockCreateUsers', mockCreateUsers);
      filteredUsers.forEach((user) => {
        const findData = mockCreateUsers.find(
          (userMock) => user.username === userMock.username,
        );
        // console.log('findData', findData);
        // console.log('user', user);
        expect(findData).not.toBeUndefined();
      });
      done();
    });
  });

  it('findUserByName -> should be get one user', (done: jest.DoneCallback) => {
    service
      .findUserByName(mockCreateUsers[0].username)
      .subscribe((out: PresenterOutput) => {
        expect(out.data.username).toEqual(mockCreateUsers[0].username);
        expect(out.data.email).toEqual(mockCreateUsers[0].email);
        expect(out.data.fullname).toEqual(mockCreateUsers[0].fullname);
        expect(out.data.image_url).toEqual(mockCreateUsers[0].image_url);
        expect(out.data).not.toHaveProperty('password');
        expect(out.data).toHaveProperty('id');

        done();
      });
  });

  it('findUserByName -> should be throw error user not found', (done: jest.DoneCallback) => {
    service.findUserByName('testUser.username').subscribe({
      next: () => {
        done.fail('User should not exist');
      },
      error: (err) => {
        if (err instanceof NotFoundException) {
          expect(err.message).toEqual('User not found');
          done();
        } else done.fail('Error is not NotFoundException');
      },
    });
  });

  it('createUser -> should be create one user', (done: jest.DoneCallback) => {
    service.createUser(mockCreateUsers[1]).subscribe({
      next: (out: PresenterOutput) => {
        const testUser1ExcPass = mockCreateUsers[1];
        delete testUser1ExcPass.password;
        const { createdAt, role, id, ...createdData } = out.data;

        // console.log('Test-User-Service-createUser actual out', out);
        expect(out.status).toEqual(HttpStatus.CREATED);
        expect(out.message).toEqual('User Created');
        expect(createdData).toEqual(testUser1ExcPass);
        expect(out.data).not.toContain('password');
        expect(id).not.toEqual('');
        expect(createdAt).not.toEqual('');
        done();
      },
      error: (err) => {
        console.error('Test failed with error', err);
        done.fail('create user fail');
      },
    });
  });

  it('createUser -> should be get error User Already Exist', (done: jest.DoneCallback) => {
    service.createUser(mockCreateUsers[1]).subscribe({
      next: () => {
        done.fail('User should not created');
      },
      error: (err) => {
        if (err instanceof BadRequestException) {
          expect(err.message).toEqual('User already exist');
          done();
        } else done.fail('Error is not BadRequestException');
      },
    });
  });

  it('deleteUser -> should be delete one user', (done: jest.DoneCallback) => {
    service.deleteUser(mockCreateUsers[2].username).subscribe({
      next: (out: PresenterOutput) => {
        const presenter: PresenterOutput = {
          status: HttpStatus.OK,
          message: 'User deleted',
          data: { username: mockCreateUsers[2].username },
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

  it('deleteUser -> should be throw NotFoundException and get error User not found', (done: jest.DoneCallback) => {
    service.deleteUser('mockCreateUsers').subscribe({
      next: () => {
        done.fail('User should not deleted');
      },
      error: (err) => {
        if (err instanceof NotFoundException) {
          expect(err.message).toEqual('User not found');
          done();
        } else done.fail('Error is not NotFoundException');
      },
    });
  });

  afterAll(async () => {
    await cleanupDbAfterEachTest(connection);
  });
});
