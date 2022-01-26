import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { from } from 'rxjs';

import { UserService } from '../../user/services/user.service';
import { AuthService } from './auth.service';

const mockUserRepository = {
  username: 'test',
  password: '123456',
  id: 'wer234234',
};
const mockUserService = {
  validateUser: jest.fn().mockImplementation((username, password) => {
    if (
      username === mockUserRepository.username &&
      password === mockUserRepository.password
    ) {
      return {
        username: mockUserRepository.username,
        sub: mockUserRepository.id,
      };
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

const mockJwtService = {
  sign: jest.fn().mockImplementation(() => 'token'),
};

describe('AuthService', () => {
  let service: AuthService;
  process.env['JWT_SECRET'] = 'secret';
  process.env['JWT_EXPIRED_IN'] = '60s';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login -> should return payload and proper response', async () => {
    const result = await service.login({
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
      service.login({
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
});
