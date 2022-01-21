import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from './user.service';
import { Output } from '../../core/output';
import { UserDto } from '../dtos/user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';

import ormconfig = require('../../config/ormconfig');
import { catchError, of, pipe } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

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
    service.findUserByName(testUser.username).subscribe((user: UserDto) => {
      // console.log('Test-User-Service-findUserByName user', user);

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

  // it('should be create one user', (done: jest.DoneCallback) => {
  //   const user: CreateUserDto = {
  //     username: 'miftah-salam',
  //     password: '123456',
  //     email: 'salam.miftah@gmail.com',
  //     fullname: 'Miftah Salam',
  //     image_url: 'https://www.test.com',
  //   };
  //   service.createUser(user).subscribe((out: Output) => {
  //     console.log('Test-User-Service-createUser out', out);
  //     done();
  //   });
  // });

  afterAll(async () => {
    await connection
      .createQueryBuilder(UserEntity, 'users')
      .delete()
      .from(UserEntity)
      .where('username = :username', { username: testUser.username })
      .execute();
    await connection.close();
  });
});
