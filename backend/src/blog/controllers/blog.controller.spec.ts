import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import slugify from 'slugify';

import { Role } from '../../auth/roles.enum';
import { PresenterOutput } from '../../core/presenter';

import { BlogService } from '../services/blog.service';
import { BlogController } from './blog.controller';

const mockBlogRespository = [
  {
    id: '23423sds',
    title: 'Blog title 1',
    slug: 'Blog-title-1',
    image_url: 'http://blog1.blogspot.image.com',
    description: 'This is blog article 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    content: 'This blog is about bla...bla...',
    author: {
      id: '567ghfgh',
      username: 'test-user1',
      role: 'user',
    },
  },
  {
    id: '9954dghhd',
    title: 'Blog title 2',
    slug: 'Blog-title-2',
    image_url: 'http://blog2.blogspot.image.com',
    description: 'This is blog article 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    content: 'This blog is about bla...bla...',
    author: {
      id: '567ghfgh',
      username: 'test-user1',
      role: 'user',
    },
  },
  {
    id: '12312scvcv',
    title: 'Blog title 3',
    slug: 'Blog-title-3',
    image_url: 'http://blog3.blogspot.image.com',
    description: 'This is blog article 3',
    createdAt: new Date(),
    updatedAt: new Date(),
    content: 'This blog is about bla...bla...',
    author: {
      id: '56456scvxc',
      username: 'test-user3',
      role: 'user',
    },
  },
];
const mockCreateBlog = {
  title: 'Blog title 4',
  description: 'This is blog article 4',
  content: 'This blog is about bla...bla...',
  image_url: 'http://blog4.blogspot.image.com',
};
const mockBlogService = {
  findAllBlogByUser: jest.fn().mockImplementation((username) => {
    const blogs = mockBlogRespository.filter(
      (blog) => blog.author.username === username,
    );

    if (!blogs || blogs.length < 1)
      throw new NotFoundException(
        'Current user does not have blog article yet',
      );

    let presenter: PresenterOutput;
    presenter = {
      status: HttpStatus.OK,
      message: 'Blogs found',
      data: blogs,
    };

    return of(presenter);
  }),
  findBlogBySlug: jest.fn().mockImplementation((slug, username) => {
    const blog = mockBlogRespository.find((blog) => blog.slug === slug);

    if (!blog) throw new NotFoundException('Blog with current title not found');

    const isAuthor = blog.author.username === username;
    const isAdmin = blog.author.role === Role.ADMIN;
    let returnVal = true;

    if (!isAdmin) {
      if (!isAuthor) returnVal = false;
    }
    if (!returnVal)
      throw new ForbiddenException('Access forbidden for this user');

    let presenter: PresenterOutput;
    presenter = {
      status: HttpStatus.OK,
      message: 'Blog found',
      data: blog,
    };

    return of(presenter);
  }),
  deleteBlog: jest.fn().mockImplementation((id, username) => {
    const blog = mockBlogRespository.find((blog) => blog.id === id);

    if (!blog) throw new NotFoundException('Blog with current title not found');

    const isAuthor = blog.author.username === username;
    const isAdmin = blog.author.role === Role.ADMIN;
    let returnVal = true;

    if (!isAdmin) {
      if (!isAuthor) returnVal = false;
    }
    if (!returnVal)
      throw new ForbiddenException('Access forbidden for this user');

    let presenter: PresenterOutput;
    presenter = {
      status: HttpStatus.OK,
      message: 'Blog deleted',
      data: { title: blog.title },
    };

    return of(presenter);
  }),
  createBlog: jest.fn().mockImplementation((createBlogDto, username) => {
    const blog = mockBlogRespository.find(
      (blog) => blog.slug === slugify(createBlogDto.title),
    );

    if (blog) throw new BadRequestException('Blog title already exists');

    let presenter: PresenterOutput;
    presenter = {
      status: HttpStatus.CREATED,
      message: 'Blog created',
      data: {
        id: '97655sdfsdg',
        title: createBlogDto.title,
        slug: 'Blog-title-4',
        image_url: createBlogDto.image_url,
        description: createBlogDto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: '56456scvxc',
          username: username,
          role: 'user',
        },
      },
    };

    return of(presenter);
  }),
  updateBlog: jest.fn().mockImplementation((updateBlogDto, username) => {
    let findIndex = -1;
    const blog = mockBlogRespository.find((blog, index) => {
      findIndex = index;
      if (blog.slug === slugify(updateBlogDto.title)) return true;
      else return false;
    });

    if (!blog) throw new NotFoundException('Blog with current title not found');

    const isAuthor = blog.author.username === username;
    const isAdmin = blog.author.role === Role.ADMIN;
    let returnVal = true;

    if (!isAdmin) {
      if (!isAuthor) returnVal = false;
    }
    if (!returnVal)
      throw new ForbiddenException('Access forbidden for this user');

    mockBlogRespository[findIndex] = {
      id: updateBlogDto.id,
      title: updateBlogDto.title,
      slug: slugify(updateBlogDto.title),
      image_url: updateBlogDto.image_url,
      description: updateBlogDto.description,
      content: updateBlogDto.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: '56456scvxc',
        username: username,
        role: 'user',
      },
    };
    let presenter: PresenterOutput;
    presenter = {
      status: HttpStatus.OK,
      message: 'Blog updated',
      data: {
        id: updateBlogDto.id,
        title: updateBlogDto.title,
        slug: slugify(updateBlogDto.title),
        image_url: updateBlogDto.image_url,
        description: updateBlogDto.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: '56456scvxc',
          username: username,
          role: 'user',
        },
      },
    };

    return of(presenter);
  }),
};

describe('BlogController', () => {
  let controller: BlogController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: BlogService, useValue: mockBlogService }],
      controllers: [BlogController],
    }).compile();

    controller = module.get<BlogController>(BlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUserBlogs -> should get all blogs from current logged user', (done: jest.DoneCallback) => {
    const req = { user: { username: 'test-user1' } };

    controller.findAllUserBlogs(req).subscribe({
      next: (out) => {
        let expectedData = mockBlogRespository.filter(
          (blog) => blog.author.username === 'test-user1',
        );
        const expectedOut: PresenterOutput = {
          status: HttpStatus.OK,
          message: 'Blogs found',
          data: expectedData,
        };

        expect(out).toEqual(expectedOut);
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail('Failed. Blogs should be found');
      },
    });
  });

  it('findAllUserBlogs -> should be return Current user does not have blog article yet', (done: jest.DoneCallback) => {
    const findAllUserBlogs = () => {
      const req = { user: { username: 'test-user12' } };
      controller.findAllUserBlogs(req).subscribe({
        next: (output: PresenterOutput) => {
          done.fail('Failed. Blogs should not found');
        },
      });
    };

    expect(findAllUserBlogs).toThrowError(
      'Current user does not have blog article yet',
    );
    expect(findAllUserBlogs).toThrowError(NotFoundException);
    done();
  });

  it('findBlogBySlug -> should get blog by slug from current logged user', (done: jest.DoneCallback) => {
    const req = { user: { username: 'test-user1' } };

    controller.findBlogBySlug('Blog-title-1', req).subscribe({
      next: (out) => {
        let expectedData = mockBlogRespository.find(
          (blog) => blog.author.username === 'test-user1',
        );
        const expectedOut: PresenterOutput = {
          status: HttpStatus.OK,
          message: 'Blog found',
          data: expectedData,
        };

        expect(out).toEqual(expectedOut);
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail('Failed. Blog should be found');
      },
    });
  });

  it('findBlogBySlug -> should be return Blog with current title not found', (done: jest.DoneCallback) => {
    const findBlogBySlug = () => {
      const req = { user: { username: 'test-user1' } };
      controller.findBlogBySlug('gfh', req).subscribe({
        next: (output: PresenterOutput) => {
          done.fail('Failed. Blogs should not found');
        },
      });
    };

    expect(findBlogBySlug).toThrowError('Blog with current title not found');
    expect(findBlogBySlug).toThrowError(NotFoundException);
    done();
  });

  it('findBlogBySlug -> should be return Access forbidden for this user', (done: jest.DoneCallback) => {
    const findBlogBySlug = () => {
      const req = { user: { username: 'test-user12' } };
      controller.findBlogBySlug('Blog-title-1', req).subscribe({
        next: (output: PresenterOutput) => {
          done.fail('Failed. Blog should not found');
        },
      });
    };

    expect(findBlogBySlug).toThrowError('Access forbidden for this user');
    expect(findBlogBySlug).toThrowError(ForbiddenException);
    done();
  });

  it('createBlog -> should be return http status 201 and proper presenter output', (done: jest.DoneCallback) => {
    const req = { user: { username: 'test-user12' } };

    controller.createBlog(mockCreateBlog, req).subscribe({
      next: (output: PresenterOutput) => {
        const { id, createdAt, slug, updatedAt, author, ...outData } =
          output.data;
        const { content, ...expectedData } = mockCreateBlog;

        expect(output.status).toEqual(HttpStatus.CREATED);
        expect(output.message).toEqual('Blog created');
        expect(outData).toEqual(expectedData);
        expect(author.username).toEqual(req.user.username);
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail('Failed. User should be created');
      },
    });
  });

  it('createBlog -> should be return throw bad request exception blog already exist', (done: jest.DoneCallback) => {
    const req = { user: { username: 'test-user12' } };

    const createBlog = () => {
      controller
        .createBlog(
          {
            title: 'Blog title 1',
            image_url: 'http://blog1.blogspot.image.com',
            description: 'This is blog article 1',
            content: 'This blog is about bla...bla...',
          },
          req,
        )
        .subscribe({
          next: (output: PresenterOutput) => {
            done.fail('Failed. User should not be created');
          },
        });
    };

    expect(createBlog).toThrowError('Blog title already exists');
    expect(createBlog).toThrowError(BadRequestException);
    done();
  });

  it('updateBlog -> should be return http status 200 and proper presenter output', (done: jest.DoneCallback) => {
    const req = { user: { username: 'test-user1' } };

    controller.updateBlog(mockBlogRespository[0], req).subscribe({
      next: (output: PresenterOutput) => {
        // const { id, createdAt, slug, updatedAt, author, ...outData } =
        //   output.data;
        const { content, ...expectedData } = mockBlogRespository[0];

        expect(output.status).toEqual(HttpStatus.OK);
        expect(output.message).toEqual('Blog updated');
        expect(output.data).toEqual(expectedData);
        expect(output.data.author.username).toEqual(req.user.username);
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail('Failed. User should be updated');
      },
    });
  });

  it('updateBlog -> should be return Blog with current title not found', (done: jest.DoneCallback) => {
    const updateBlog = () => {
      const req = { user: { username: 'test-user1' } };
      controller
        .updateBlog({ ...mockCreateBlog, id: 'sadfaahh7544' }, req)
        .subscribe({
          next: (output: PresenterOutput) => {
            done.fail('Failed. Blogs should not found');
          },
        });
    };

    expect(updateBlog).toThrowError('Blog with current title not found');
    expect(updateBlog).toThrowError(NotFoundException);
    done();
  });

  it('updateBlog -> should be return Access forbidden for this user', (done: jest.DoneCallback) => {
    const updateBlog = () => {
      const req = { user: { username: 'test-user12' } };
      controller.updateBlog(mockBlogRespository[0], req).subscribe({
        next: (output: PresenterOutput) => {
          done.fail('Failed. Blog should not found');
        },
      });
    };

    expect(updateBlog).toThrowError('Access forbidden for this user');
    expect(updateBlog).toThrowError(ForbiddenException);
    done();
  });

  it('deleteBlog -> should be return http status 200 and proper presenter output', (done: jest.DoneCallback) => {
    const req = { user: { username: 'test-user1' } };

    controller.deleteBlog(mockBlogRespository[0].id, req).subscribe({
      next: (output: PresenterOutput) => {
        // const { id, createdAt, slug, updatedAt, author, ...outData } =
        //   output.data;
        const { content, ...expectedData } = mockBlogRespository[0];

        expect(output.status).toEqual(HttpStatus.OK);
        expect(output.message).toEqual('Blog deleted');
        expect(output.data).toEqual({ title: mockBlogRespository[0].title });
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail('Failed. User should be deleted');
      },
    });
  });

  it('deleteBlog -> should be return Blog with current title not found', (done: jest.DoneCallback) => {
    const deleteBlog = () => {
      const req = { user: { username: 'test-user1' } };
      controller.deleteBlog('sadfaahh7544', req).subscribe({
        next: (output: PresenterOutput) => {
          done.fail('Failed. Blogs should not found');
        },
      });
    };

    expect(deleteBlog).toThrowError('Blog with current title not found');
    expect(deleteBlog).toThrowError(NotFoundException);
    done();
  });

  it('deleteBlog -> should be return Access forbidden for this user', (done: jest.DoneCallback) => {
    const deleteBlog = () => {
      const req = { user: { username: 'test-user12' } };
      controller.deleteBlog(mockBlogRespository[0].id, req).subscribe({
        next: (output: PresenterOutput) => {
          done.fail('Failed. Blog should not deleted');
        },
      });
    };

    expect(deleteBlog).toThrowError('Access forbidden for this user');
    expect(deleteBlog).toThrowError(ForbiddenException);
    done();
  });
});
