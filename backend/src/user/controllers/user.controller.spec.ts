import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Role } from '../../auth/roles.enum';
import { PresenterOutput } from 'src/core/presenter';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

let mockUserRepository: UserEntity[] = [
  {
    id: '123sdfs456',
    username: 'test-user1',
    fullname: 'Test User 1',
    password: '123456',
    image_url: 'string',
    email: 'test1@yahoo.com',
    createdAt: new Date(),
    role: Role.USER,
    hashPassword: jest.fn(),
  },
  {
    username: 'test-user',
    email: 'test@yahoo.com',
    password: '123456',
    fullname: 'Test User',
    image_url: 'http://www.test.user',
    id: '678sdfs90',
    role: Role.USER,
    createdAt: new Date(),
    hashPassword: jest.fn(),
  },
  {
    createdAt: new Date(),
    username: 'test-delete',
    email: 'test-delete@yahoo.com',
    password: 'delete123',
    fullname: 'Test User For Delete',
    image_url: 'http://www.test.delete',
    role: Role.USER,
    hashPassword: jest.fn(),
    id: '678sdfsss90',
  },
];
const mockUserService = {
  deleteUser: jest.fn().mockImplementation((username) => {
    if (mockUserRepository.find((user) => user.username === username)) {
      const output: PresenterOutput = {
        status: HttpStatus.OK,
        message: 'User deleted',
        data: {
          username: username,
        },
      };

      mockUserRepository = mockUserRepository.filter(
        (user) => user.username !== username,
      );
      return of(output);
    } else throw new BadRequestException('User not found');
  }),
  createUser: jest.fn().mockImplementation((userDto: CreateUserDto) => {
    if (
      !mockUserRepository.find((user) => user.username === userDto.username)
    ) {
      const newUser: UserEntity = {
        createdAt: new Date(),
        ...userDto,
        role: Role.USER,
        id: '1212123sdfs456',
        hashPassword: jest.fn(),
      };
      const output: PresenterOutput = {
        status: HttpStatus.CREATED,
        message: 'User Created',
        data: {
          createdAt: newUser.createdAt,
          username: newUser.username,
          email: newUser.email,
          id: newUser.id,
          role: Role.USER,
          fullname: newUser.fullname,
          image_url: newUser.image_url,
        },
      };

      mockUserRepository.push(newUser);
      return of(output);
    } else throw new BadRequestException('User already exist');
  }),
  findUserByName: jest.fn().mockImplementation((username: string) => {
    let output: PresenterOutput;
    let foundedUser = mockUserRepository.find(
      (user) => user.username === username,
    );
    if (foundedUser) {
      delete foundedUser.password;
      output = {
        status: HttpStatus.OK,
        message: 'User Found',
        data: foundedUser,
      };
      return of(output);
    } else throw new NotFoundException('User not found exist');
  }),
  findUserByNameAsync: jest.fn(),
};
const mockNewUser: CreateUserDto = {
  username: 'miftah-salam',
  email: 'miftah@yahoo.com',
  fullname: 'Miftah SAlam',
  image_url: 'http://www.miftah.salam',
  password: '123456',
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deleteUser -> should be return http status 200 and proper presenter output', (done: jest.DoneCallback) => {
    controller.deleteUser('test-delete').subscribe({
      next: (output: PresenterOutput) => {
        const expectedOut: PresenterOutput = {
          status: HttpStatus.OK,
          message: 'User deleted',
          data: { username: 'test-delete' },
        };

        expect(output).toEqual(expectedOut);
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail('Failed. User should be deleted');
      },
    });
  });

  it('deleteUser -> should be return throw bad request abd get error user not found', (done: jest.DoneCallback) => {
    const deletedUser = () => {
      controller.deleteUser('mockNewUskljkler').subscribe({
        next: (output: PresenterOutput) => {
          done.fail('Failed. User should not found');
        },
      });
    };

    expect(deletedUser).toThrowError('User not found');
    expect(deletedUser).toThrowError(BadRequestException);
    done();
  });

  it('findUser -> should be return http status 200 and proper presenter output', (done: jest.DoneCallback) => {
    controller.findUser('test-user').subscribe({
      next: (output: PresenterOutput) => {
        let expectedData = mockUserRepository.find(
          (user) => user.username === 'test-user',
        );
        delete expectedData.password;
        const expectedOut: PresenterOutput = {
          status: HttpStatus.OK,
          message: 'User Found',
          data: expectedData,
        };

        expect(output).toEqual(expectedOut);
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail('Failed. User should be found');
      },
    });
  });

  it('findUser -> should be return throw not found exception', (done: jest.DoneCallback) => {
    const findUser = () => {
      controller.findUser('mockNewUskljkler').subscribe({
        next: (output: PresenterOutput) => {
          done.fail('Failed. User should not found');
        },
      });
    };

    expect(findUser).toThrowError('User not found');
    expect(findUser).toThrowError(NotFoundException);
    done();
  });

  it('register -> should be return http status 201 and proper presenter output', (done: jest.DoneCallback) => {
    controller.register(mockNewUser).subscribe({
      next: (output: PresenterOutput) => {
        const { password, hashPassword, ...expectedData } =
          mockUserRepository[mockUserRepository.length - 1];
        const expectedOut: PresenterOutput = {
          status: HttpStatus.CREATED,
          message: 'User Created',
          data: expectedData,
        };

        expect(output).toEqual(expectedOut);
        done();
      },
      error: (err) => {
        console.error(err);
        done.fail('Failed. User should be created');
      },
    });
  });

  it('register -> should be return throw bad request exception user already exist', (done: jest.DoneCallback) => {
    const register = () => {
      controller.register(mockNewUser).subscribe({
        next: (output: PresenterOutput) => {
          done.fail('Failed. User should not be created');
        },
      });
    };

    expect(register).toThrowError('User already exist');
    expect(register).toThrowError(BadRequestException);
    done();
  });
});
