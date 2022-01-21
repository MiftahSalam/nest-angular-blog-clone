import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { from, Observable, switchMap, of, tap } from 'rxjs';
import { Output } from '../../core/output';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userService: Repository<UserEntity>,
  ) {}

  createUser(user: CreateUserDto): Observable<Output> {
    // console.log('User-Service-createUser');

    return from(this.findUserByName(user.username)).pipe(
      switchMap((user: UserDto) => {
        console.log('User-Service-createUser user', user);

        const out: Output = new Output();
        out.status = 'Created';
        out.message = 'User create';
        out.data = {};

        return of(out);
      }),
    );
    // const out: Output = new Output;
    // out.status = "Created";
    // out.message = "User created";
    // out.data = {};

    // return out;
  }
  findUserById(id: string): Observable<UserDto> {
    return from(this.userService.findOne(id));
  }

  findUserByName(username: string): Observable<UserDto> {
    // console.log('User-Service-findUserByName username', username);
    return from(
      this.userService.findOne({ where: { username: username } }),
    ).pipe(
      switchMap((user: UserEntity) => {
        if (!user) throw new NotFoundException('User not found');
        return from(user.toDto());
      }),
    );
  }

  async findUserByNameAsync(username: string): Promise<UserDto> {
    console.log('User-Service-findUserByName username', username);

    const user = await this.userService.findOne({
      where: { username: username },
    });

    console.log('User-Service-findUserByName user', user);

    return user;
  }
}
