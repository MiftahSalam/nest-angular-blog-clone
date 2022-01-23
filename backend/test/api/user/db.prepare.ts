import { UserEntity } from '../../../src/user/entities/user.entity';
import { Connection } from 'typeorm';

const testUser = {
  username: 'test-user',
  email: 'test@yahoo.com',
  password: '123456',
  fullname: 'Test User',
  image_url: 'http://www.test.user',
};
const testUser1 = {
  username: 'test-user1',
  email: 'test1@yahoo.com',
  password: '123456',
  fullname: 'Test User 1',
  image_url: 'http://www.test.user1',
};

export const prepareDbBeforeEachTest = async (connection: Connection) => {
  await connection
    .createQueryBuilder(UserEntity, 'users')
    .insert()
    .into(UserEntity)
    .values([
      {
        username: testUser.username,
        email: testUser.email,
        password: testUser.password,
        fullname: testUser.fullname,
        image_url: testUser.image_url,
      },
    ])
    .execute();
};

export const cleanupDbAfterEachTest = async (connection: Connection) => {
  await connection
    .createQueryBuilder(UserEntity, 'users')
    .delete()
    .from(UserEntity)
    .where('username = :username', { username: testUser.username })
    .execute();
  await connection
    .createQueryBuilder(UserEntity, 'users')
    .delete()
    .from(UserEntity)
    .where('username = :username', { username: testUser1.username })
    .execute();
  await connection.close();
};
