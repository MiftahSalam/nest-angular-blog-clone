import { CreateBlogDto } from '../../../src/blog/dtos/CreateBlog.dto';
import { BlogEntity } from '../../../src/blog/entities/blog.entity';
import { Connection, In } from 'typeorm';
import { mockCreateUsers, prepareDbBeforeEachTest } from '../user/db.prepare';
import { UserEntity } from '../../../src/user/entities/user.entity';

export const mockCreateBlogs: CreateBlogDto[] = [
  {
    title: 'Blog title 1',
    description: 'This is blog article 1',
    content: 'This blog is about bla...bla...',
    image_url: 'http://blog1.blogspot.image.com',
  },
  {
    title: 'Blog title 2',
    description: 'This is blog article 2',
    content: 'This blog is about bla...bla...',
    image_url: 'http://blog2.blogspot.image.com',
  },
  {
    title: 'Blog title 3',
    description: 'This is blog article 3',
    content: 'This blog is about bla...bla...',
    image_url: 'http://blog3.blogspot.image.com',
  },
  {
    title: 'Blog title 4',
    description: 'This is blog article 4',
    content: 'This blog is about bla...bla...',
    image_url: 'http://blog4.blogspot.image.com',
  },
];

export const prepareDbBlogBeforeTest = async (connection: Connection) => {
  const userRepo = connection.getRepository(UserEntity);
  const user1 = await userRepo.findOne({
    username: mockCreateUsers[0].username,
  });
  const blogRepo = connection.getRepository(BlogEntity);
  const blog = blogRepo.create({ ...mockCreateBlogs[0], author: user1 });
  const blog1 = blogRepo.create({ ...mockCreateBlogs[2], author: user1 });
  const blog2 = blogRepo.create({ ...mockCreateBlogs[3], author: user1 });
  // await repo.save([user, user1]);
  return blogRepo.save([blog, blog1, blog2]);
};

// export const cleanupDbBlogAfterTest = async (connection: Connection) => {
//   const repo = connection.getRepository(BlogEntity);
//   const blogs = await repo.find({
//     title: In(mockCreateBlogs.map((blog) => blog.title)),
//   });

//   // console.log('cleanupDbAfterEachTest', users);

//   if (blogs) {
//     await repo.remove(blogs);
//   }
//   await connection.close();
// };
