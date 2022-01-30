import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { UserModule } from '../user/user.module';
import { BlogEntity } from './entities/blog.entity';
import { BlogService } from './services/blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, UserEntity]), UserModule],
  providers: [BlogService, UserService],
})
export class BlogModule {}
