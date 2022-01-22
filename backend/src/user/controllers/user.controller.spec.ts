import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
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
    hashPassword: jest.fn(),
  },
  {
    username: 'test-user',
    email: 'test@yahoo.com',
    password: '123456',
    fullname: 'Test User',
    image_url: 'http://www.test.user',
    id: '678sdfs90',
    createdAt: new Date(),
    hashPassword: jest.fn(),
  },
];
const mockUserService = {
  createUser: jest.fn().mockImplementation((userDto: CreateUserDto) => {
    if (
      !mockUserRepository.find((user) => user.username === userDto.username)
    ) {
      const newUser: UserEntity = {
        createdAt: new Date(),
        ...userDto,
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
          fullname: newUser.fullname,
          image_url: newUser.image_url,
        },
      };

      mockUserRepository.push(newUser);
      return of(output);
    } else throw new BadRequestException('User already exist');
  }),
  findUserByName: jest.fn(),
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

  it('should be return http status 201 and proper presenter output', (done: jest.DoneCallback) => {
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

  it('should be return throw bad request exception user already exist', (done: jest.DoneCallback) => {
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
