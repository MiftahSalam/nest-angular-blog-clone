import { Test, TestingModule } from '@nestjs/testing';
import {
  getConnectionToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from './user.service';

import ormconfig = require('../../config/ormconfig');

describe('UserService', () => {
  let service: UserService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormconfig[0]),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [
        UserService,
        Repository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    connection = await module.get(getConnectionToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await connection.close();
  });
});
