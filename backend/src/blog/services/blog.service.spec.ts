import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import {
  // cleanupDbBlogAfterTest,
  prepareDbBlogBeforeTest,
} from '../../../test/api/blog/blog.db.prepare';
import { Connection, Repository } from 'typeorm';
import { BlogEntity } from '../entities/blog.entity';

import { BlogService } from './blog.service';
import { UserService } from '../../../src/user/services/user.service';
import { UserModule } from '../../../src/user/user.module';
import { UserEntity } from '../../../src/user/entities/user.entity';
import { cleanupDbAfterEachTest } from '../../../test/api/user/db.prepare';

const ormconfig = require('../../config/ormconfig');

describe('BlogService', () => {
  let service: BlogService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormconfig[0]),
        TypeOrmModule.forFeature([BlogEntity, UserEntity]),
        UserModule,
      ],
      providers: [BlogService, UserService, Repository],
    }).compile();

    service = module.get<BlogService>(BlogService);
    connection = await module.get(getConnectionToken());
    await prepareDbBlogBeforeTest(connection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    // await cleanupDbBlogAfterTest(connection);
    await cleanupDbAfterEachTest(connection);
  });
});
