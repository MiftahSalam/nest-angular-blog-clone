import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../user/services/user.service';
import { Role } from '../roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const userResult: any = await this.userService.validateUser(
      user.username,
      user.password,
    );

    const payload = {
      username: userResult.username,
      sub: userResult.id,
      role: userResult.role,
    };
    // const token = this.jwtService.sign(payload);

    // console.log('login payload', payload);
    // console.log('login token', token);

    return {
      status: HttpStatus.OK,
      message: 'User logged',
      data: {
        access_token: this.jwtService.sign(payload),
      },
    };
  }
}
