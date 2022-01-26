import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { from } from 'rxjs';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

const mockUserRepository = {
  username: 'test',
  password: '123456',
  id: 'wer234234',
};

const mockAuthService = {
  login: jest.fn().mockImplementation((user: LoginDto) => {
    const { password, username } = user;
    // console.log('mockAuthService', username, password);

    if (
      username === mockUserRepository.username &&
      password === mockUserRepository.password
    ) {
      const out = {
        status: 200,
        message: 'User logged',
        data: { access_token: 'token' },
      };
      return out;
    } else if (
      username === mockUserRepository.username &&
      password !== mockUserRepository.password
    ) {
      throw new UnauthorizedException('Invalid credential');
    } else {
      throw new NotFoundException('User not found');
    }
  }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login -> should return payload and proper response', async () => {
    const result = await controller.login({
      username: 'test',
      password: '123456',
    });
    const expected = {
      status: 200,
      message: 'User logged',
      data: { access_token: 'token' },
    };
    expect(result).toEqual(expected);
  });

  it('login -> should be throw invalid credential', (done: jest.DoneCallback) => {
    from(
      controller.login({
        username: 'test',
        password: 'mockNewUskljkler',
      }),
    ).subscribe({
      next: () => {
        done.fail('should get error invalid credential');
      },
      error: (err) => {
        if (err instanceof UnauthorizedException) {
          expect(err.message).toEqual('Invalid credential');
          done();
        } else done.fail('Error is not UnauthorizedException');
      },
    });
  });

  it('login -> should be throw not found user', (done: jest.DoneCallback) => {
    from(
      controller.login({
        username: 'tessst',
        password: 'mockNewUskljkler',
      }),
    ).subscribe({
      next: () => {
        done.fail('should get error user not found');
      },
      error: (err) => {
        if (err instanceof NotFoundException) {
          expect(err.message).toEqual('User not found');
          done();
        } else done.fail('Error is not NotFoundException');
      },
    });
  });
});
