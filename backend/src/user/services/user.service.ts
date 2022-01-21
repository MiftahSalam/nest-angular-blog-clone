import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userService: Repository<UserEntity>) {}

  findUserById(id: string): Observable<UserDto> {
    return from(this.userService.findOne(id));
  }
}
