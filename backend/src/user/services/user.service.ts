import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { from, Observable, switchMap, of, catchError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PresenterOutput } from 'src/core/presenter';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userService: Repository<UserEntity>,
  ) {}

  deleteUser(username: string): Observable<PresenterOutput> {
    return from(this.userService.delete({ username: username })).pipe(
      switchMap((result) => {
        if (result.affected > 0) {
          const out: PresenterOutput = {
            status: HttpStatus.OK,
            message: 'User deleted',
            data: { username: username },
          };
          return of(out);
        }

        throw new BadRequestException('User not found');
      }),
    );
  }

  createUser(user: CreateUserDto): Observable<PresenterOutput> {
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
          const newUser = this.userService.create(user);
          return from(this.userService.save(newUser)).pipe(
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
    return from(this.userService.find()).pipe(
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
  private findUser(username: string): Observable<UserEntity> {
    return from(
      this.userService.findOne({ where: { username: username } }),
    ).pipe(
      switchMap((user: UserEntity) => {
        if (!user) throw new NotFoundException('User not found');
        return of(user);
      }),
    );
  }

  async findUserByNameAsync(username: string): Promise<UserEntity> {
    console.log('User-Service-findUserByName username', username);

    const user = await this.userService.findOne({
      where: { username: username },
    });

    console.log('User-Service-findUserByName user', user);

    return user;
  }
}
