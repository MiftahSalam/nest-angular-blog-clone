import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { from, Observable, switchMap, of, catchError } from 'rxjs';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PresenterOutput } from 'src/core/presenter';
import { Role } from 'src/auth/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  deleteUser(username: string): Observable<PresenterOutput> {
    return from(this.userRepository.delete({ username: username })).pipe(
      switchMap((result) => {
        if (result.affected > 0) {
          const out: PresenterOutput = {
            status: HttpStatus.OK,
            message: 'User deleted',
            data: { username: username },
          };
          return of(out);
        }

        throw new NotFoundException('User not found');
      }),
    );
  }

  createUser(user: CreateUserDto): Observable<PresenterOutput> {
    // console.log('createUser user', user);
    return from(this.findUser(user.username)).pipe(
      catchError((err) => {
        // console.log(
        //   'Caught exception while find user with exception message:',
        //   err.message,
        // );
        return of(null);
      }),
      switchMap((userExisting: UserEntity) => {
        let presenter: PresenterOutput;

        if (!userExisting) {
          const newUser = this.userRepository.create(user);
          return from(this.userRepository.save(newUser)).pipe(
            catchError((err) => {
              console.log(
                'Caught exception while create user with exception message:',
                err.message,
              );
              return of(null);
            }),
            switchMap((userData: UserEntity) => {
              if (userData) {
                // console.log('create user userData', userData);

                delete userData.password;
                presenter = {
                  status: HttpStatus.CREATED,
                  message: 'User Created',
                  data: { ...userData },
                };
              } else
                throw new InternalServerErrorException(
                  'An error happened while create user',
                );

              return of(presenter);
            }),
          );
        } else throw new BadRequestException('User already exist');
      }),
    );
  }

  findAll(): Observable<PresenterOutput> {
    return from(this.userRepository.find()).pipe(
      switchMap((users) => {
        let presenter: PresenterOutput;

        presenter = {
          status: HttpStatus.OK,
          message: '',
          data: users,
        };
        return of(presenter);
      }),
    );
  }
  findUserByName(username: string): Observable<PresenterOutput> {
    return this.findUser(username).pipe(
      switchMap((user: UserEntity) => {
        let presenter: PresenterOutput;
        presenter = {
          status: HttpStatus.OK,
          message: 'User Found',
          data: { ...user },
        };
        return of(presenter);
      }),
    );
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findUserByNameWithPassword(username);
    console.log('validateUser user', user);
    if (user) {
      const same = await bcrypt.compare(password, user.password);
      // console.log('validateUser same', same, password);
      if (same) {
        const { password, ...result } = { ...user };
        console.log('validateUser result', result);
        return result;
      } else throw new UnauthorizedException('Invalid credential');
    }
    throw new NotFoundException('User not found');
  }

  private async findUserByNameWithPassword(
    username: string,
  ): Promise<{
    id: string;
    username: string;
    password: string;
    role: Role;
  } | null> {
    const user: UserEntity = await this.userRepository.findOne({
      select: ['password', 'id', 'username', 'role'],
      where: { username: username },
    });

    // console.log('findUserByNameWithPassword user', user);

    if (user) {
      const { id, password, username, role } = { ...user };

      return { id, password, username, role };
    }

    return null;
  }

  private findUser(username: string): Observable<UserEntity> {
    return from(
      this.userRepository.findOne({ where: { username: username } }),
    ).pipe(
      switchMap((user: UserEntity) => {
        if (!user) throw new NotFoundException('User not found');
        return of(user);
      }),
    );
  }

  async findUserByNameAsync(username: string): Promise<UserEntity> {
    console.log('User-Service-findUserByName username', username);

    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    console.log('User-Service-findUserByName user', user);

    return user;
  }
}
