import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { PresenterOutput } from 'src/core/presenter';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserService } from '../services/user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  register(@Body() createUserDto: CreateUserDto): Observable<PresenterOutput> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll(): Observable<PresenterOutput> {
    const presenter: PresenterOutput = {
      status: 200,
      message: '',
      data: { test: 'test' },
    };
    return of(presenter);
    // return this.userService.findAll();
  }

  @Get(':username')
  findUser(@Param('username') username: string): Observable<PresenterOutput> {
    return this.userService.findUserByName(username);
  }

  @Delete(':username')
  deleteUser(@Param('username') username: string): Observable<PresenterOutput> {
    return this.userService.deleteUser(username);
  }
}
