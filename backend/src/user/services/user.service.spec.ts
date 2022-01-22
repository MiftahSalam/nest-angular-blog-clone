import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';

import ormconfig = require('../../config/ormconfig');
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PresenterOutput } from 'src/core/presenter';

describe('UserService', () => {
  let service: UserService;
  let connection: Connection;
  let testUser: CreateUserDto = {
    username: 'test-user',
    email: 'test@yahoo.com',
    password: '123456',
    fullname: 'Test User',
    image_url: 'http://www.test.user',
  };
  let testUser1: CreateUserDto = {
    username: 'test-user1',
    email: 'test1@yahoo.com',
    password: '123456',
    fullname: 'Test User 1',
    image_url: 'http://www.test.user1',
  };

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
    await connection
      .createQueryBuilder(UserEntity, 'users')
      .insert()
      .into(UserEntity)
      .values([
        {
          username: testUser.username,
          email: testUser.email,
          password: testUser.password,
          fullname: testUser.fullname,
          image_url: testUser.image_url,
        },
      ])
      .execute();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should be get one user async', async () => {
  //   const user = await service.findUserByNameAsync('miftah-salam');
  // });

  it('should be get one user', (done: jest.DoneCallback) => {
    service.findUserByName(testUser.username).subscribe((user: UserEntity) => {
      expect(user.username).toEqual(testUser.username);
      expect(user.email).toEqual(testUser.email);
      expect(user.fullname).toEqual(testUser.fullname);
      expect(user.image_url).toEqual(testUser.image_url);

      done();
    });
  });

  it('should be throw error user not found', (done: jest.DoneCallback) => {
    service
      .findUserByName('testUser.username')
      .pipe()
      .subscribe({
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
    service.createUser(testUser1).subscribe({
      next: (out: PresenterOutput) => {
        const testUser1ExcPass = testUser1;
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
    service
      .findUserByName('testUser.username')
      .pipe()
      .subscribe({
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
    service.createUser(testUser1).subscribe({
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
    await connection
      .createQueryBuilder(UserEntity, 'users')
      .delete()
      .from(UserEntity)
      .where('username = :username', { username: testUser.username })
      .execute();
    await connection
      .createQueryBuilder(UserEntity, 'users')
      .delete()
      .from(UserEntity)
      .where('username = :username', { username: testUser1.username })
      .execute();
    await connection.close();
  });
});
