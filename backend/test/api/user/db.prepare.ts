import { UserEntity } from '../../../src/user/entities/user.entity';
import { Connection, In } from 'typeorm';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

export const mockCreateUsers: CreateUserDto[] = [
  {
    username: 'test-user',
    email: 'test@yahoo.com',
    password: '123456',
    fullname: 'Test User',
    image_url: 'http://www.test.user',
  },
  {
    username: 'test-user1',
    email: 'test1@yahoo.com',
    password: '123456',
    fullname: 'Test User 1',
    image_url: 'http://www.test.user1',
  },
  {
    username: 'test-delete',
    email: 'test-delete@yahoo.com',
    password: 'delete123',
    fullname: 'Test User For Delete',
    image_url: 'http://www.test.delete',
  },
];

export const prepareDbBeforeEachTest = async (connection: Connection) => {
  const repo = connection.getRepository(UserEntity);
  const user = repo.create(mockCreateUsers[0]);
  const user1 = repo.create(mockCreateUsers[2]);
  // await repo.save([user, user1]);
  return repo.save([user, user1]);
};

export const cleanupDbAfterEachTest = async (connection: Connection) => {
  const repo = connection.getRepository(UserEntity);
  const users = await repo.find({
    username: In(mockCreateUsers.map((user) => user.username)),
  });

  // console.log('cleanupDbAfterEachTest', users);

  if (users) {
    await repo.remove(users);
  }
  await connection.close();
};
