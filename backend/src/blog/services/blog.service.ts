import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import slugify from 'slugify';

import { CreateBlogDto } from '../dtos/CreateBlog.dto';
import { BlogEntity } from '../entities/blog.entity';
import { UserService } from '../../user/services/user.service';
import { PresenterOutput } from '../../core/presenter';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly userService: UserService,
  ) {}

  createBlog(
    createBlogDto: CreateBlogDto,
    username: string,
  ): Observable<PresenterOutput> {
    return from(this.isBlogAlreadyExist(createBlogDto.title)).pipe(
      switchMap((blogExist) => {
        if (blogExist)
          throw new BadRequestException('Blog title already exists');

        return from(this.userService.findUserByName(username)).pipe(
          switchMap((user) => {
            const newBlog = this.blogRepository.create({
              ...createBlogDto,
              author: user.data,
            });
            return from(this.blogRepository.save(newBlog)).pipe(
              switchMap((blogCreated) => {
                const { content, ...blogOut } = blogCreated;
                let presenter: PresenterOutput;
                presenter = {
                  status: HttpStatus.OK,
                  message: 'Blog created',
                  data: blogOut,
                };

                return of(presenter);
              }),
            );
          }),
        );
      }),
    );
  }

  private async isBlogAlreadyExist(title: string): Promise<boolean> {
    const slugCreated = slugify(title);
    const blogExist = await this.blogRepository.findOne({
      where: { slug: slugCreated },
      select: ['slug'],
    });

    return !!blogExist;
  }
}
