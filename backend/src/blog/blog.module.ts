import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { UserModule } from '../user/user.module';
import { BlogEntity } from './entities/blog.entity';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, UserEntity]), UserModule],
  providers: [BlogService, UserService],
  controllers: [BlogController],
})
export class BlogModule {}
