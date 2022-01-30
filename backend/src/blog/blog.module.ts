import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user.service';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from '../user/entities/user.entity';
import { BlogEntity } from './entities/blog.entity';
import { BlogService } from './services/blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, UserEntity]), UserModule],
  providers: [BlogService, UserService],
})
export class BlogModule {}
