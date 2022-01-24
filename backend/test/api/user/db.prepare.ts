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
];

export const prepareDbBeforeEachTest = async (connection: Connection) => {
  await connection
    .createQueryBuilder(UserEntity, 'users')
    .insert()
    .into(UserEntity)
    .values([mockCreateUsers[0]])
    .execute();
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
