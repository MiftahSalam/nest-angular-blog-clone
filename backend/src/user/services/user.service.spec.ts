import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

import { PresenterOutput } from 'src/core/presenter';
import { UserEntity } from '../entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import ormconfig = require('../../config/ormconfig');

import {
  mockCreateUsers,
  prepareDbBeforeEachTest,
  cleanupDbAfterEachTest,
} from '../../../test/api/user/db.prepare';

jest.setTimeout(100000);

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

  it('should be get one user', (done: jest.DoneCallback) => {
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

  it('should be throw error user not found', (done: jest.DoneCallback) => {
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

  it('should be create one user', (done: jest.DoneCallback) => {
    service.createUser(mockCreateUsers[1]).subscribe({
      next: (out: PresenterOutput) => {
        const testUser1ExcPass = mockCreateUsers[1];
        delete testUser1ExcPass.password;
        const presenter: PresenterOutput = {
          status: HttpStatus.CREATED,
          message: 'User Created',
          data: testUser1ExcPass,
        };
        expect(out).toEqual(presenter);
        expect(out).not.toContain('password');
        done();
        // console.log('Test-User-Service-createUser actual out', out);
      },
      error: (err) => {
        console.error('Test failed with error', err);
        done.fail('create user fail');
      },
    });
  });

  it('should be get error User already exist', (done: jest.DoneCallback) => {
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

  afterAll(async () => {
    await cleanupDbAfterEachTest(connection);
  });
});
