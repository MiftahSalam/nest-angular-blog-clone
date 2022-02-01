import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap } from 'rxjs';
import { Repository } from 'typeorm';
import slugify from 'slugify';

import { CreateBlogDto } from '../dtos/CreateBlog.dto';
import { BlogEntity } from '../entities/blog.entity';
import { UserService } from '../../user/services/user.service';
import { PresenterOutput } from '../../core/presenter';
import { Role } from '../../auth/roles.enum';
import { UpdateBlogDto } from '../dtos/UpdateBlog.dto';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly userService: UserService,
  ) {}

  deleteBlog(id: string, username: string): Observable<PresenterOutput> {
    return from(
      this.blogRepository.findOne({
        where: { id: id },
        relations: ['author'],
      }),
    ).pipe(
      switchMap((blog) => {
        // console.log('deleteBlog blog', blog);
        if (!blog)
          throw new NotFoundException('Blog with current id not found');

        const passAccess = this.isAuthorOrAdmin(username, blog.author);
        if (!passAccess)
          throw new ForbiddenException('Access forbidden for this user');

        return from(this.blogRepository.delete(id)).pipe(
          switchMap((result) => {
            // console.log('deleteBlog result', result);
            if (result.affected > 0) {
              let presenter: PresenterOutput;
              presenter = {
                status: HttpStatus.OK,
                message: 'Blog deleted',
                data: { title: blog.title },
              };

              return of(presenter);
            }
            throw new InternalServerErrorException('Cannot delete blog');
          }),
        );
      }),
    );
  }

  updateBlog(
    updateBlogDto: UpdateBlogDto,
    username: string,
  ): Observable<PresenterOutput> {
    return from(
      this.blogRepository.findOne({
        where: { id: updateBlogDto.id },
        relations: ['author'],
      }),
    ).pipe(
      switchMap((blog) => {
        if (!blog)
          throw new NotFoundException('Blog with current title not found');

        const passAccess = this.isAuthorOrAdmin(username, blog.author);
        if (!passAccess)
          throw new ForbiddenException('Access forbidden for this user');

        return from(this.blogRepository.update(blog.id, updateBlogDto)).pipe(
          switchMap((result) => {
            // console.log('updateBlog result', result);
            if (result.affected > 0) {
              let presenter: PresenterOutput;
              presenter = {
                status: HttpStatus.OK,
                message: 'Blog updated',
                data: blog,
              };

              return of(presenter);
            }
            throw new InternalServerErrorException('Cannot delete blog');
          }),
        );
      }),
    );
  }

  findAllBlogByUser(username: string): Observable<PresenterOutput> {
    return from(
      this.blogRepository
        .createQueryBuilder('blogs')
        .innerJoinAndSelect('blogs.author', 'author')
        .where('author.username = :username', { username })
        .getMany(),
    ).pipe(
      switchMap((blogs) => {
        // console.log('findAllBlogByUser blogs', blogs);
        if (!blogs || blogs.length < 1)
          throw new NotFoundException(
            'Current user does not have blog article yet',
          );

        const passAccess = this.isAuthorOrAdmin(username, blogs[0].author);
        if (!passAccess)
          throw new ForbiddenException('Access forbidden for this user');

        let presenter: PresenterOutput;
        presenter = {
          status: HttpStatus.OK,
          message: 'Blogs found',
          data: blogs,
        };

        return of(presenter);
      }),
    );
  }

  findBlogBySlug(slug: string, username: string): Observable<PresenterOutput> {
    return from(
      this.blogRepository.findOne({
        where: { slug: slug },
        relations: ['author'],
      }),
    ).pipe(
      switchMap((blog) => {
        // console.log('findBlogBySlug blog', blog);
        if (!blog)
          throw new NotFoundException('Blog with current title not found');

        const passAccess = this.isAuthorOrAdmin(username, blog.author);
        if (!passAccess)
          throw new ForbiddenException('Access forbidden for this user');

        let presenter: PresenterOutput;
        presenter = {
          status: HttpStatus.OK,
          message: 'Blog found',
          data: blog,
        };

        return of(presenter);
      }),
    );
  }

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
            // console.log('createBlog newBlog', newBlog);
            return from(this.blogRepository.save(newBlog)).pipe(
              switchMap((blogCreated) => {
                const { content, ...blogOut } = blogCreated;
                let presenter: PresenterOutput;
                presenter = {
                  status: HttpStatus.OK,
                  message: 'Blog created',
                  data: blogOut,
                };
                // console.log('createBlog blogCreated', blogCreated);

                return of(presenter);
              }),
            );
          }),
        );
      }),
    );
  }

  private isAuthorOrAdmin(poster: string, blogAuthor: UserEntity): boolean {
    const isAuthor = blogAuthor.username === poster;
    const isAdmin = blogAuthor.role === Role.ADMIN;
    let returnVal = true;

    // console.log('isAuthorOrAdmin isAdmin', isAdmin);
    // console.log('isAuthorOrAdmin isAuthor', isAuthor);

    if (!isAdmin) {
      if (!isAuthor) returnVal = false;
    }
    return returnVal;
  }

  private async isBlogAlreadyExist(title: string): Promise<boolean> {
    const slugCreated = slugify(title);
    const blogExist = await this.blogRepository.findOne({
      where: { slug: slugCreated },
      select: ['slug'],
    });
    // console.log('isBlogAlreadyExist blogExist', !!blogExist);

    return !!blogExist;
  }
}
