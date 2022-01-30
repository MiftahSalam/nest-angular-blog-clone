import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user.service';
import { UserModule } from 'src/user/user.module';
import { BlogEntity } from './entities/blog.entity';
import { BlogService } from './services/blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), UserModule],
  providers: [BlogService, UserService],
})
export class BlogModule {}
