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
import { Observable } from 'rxjs';
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

  @Get(':username')
  findUser(@Param('username') username: string): Observable<PresenterOutput> {
    return this.userService.findUserByName(username);
  }

  @Delete(':username')
  deleteUser(@Param('username') username: string): Observable<PresenterOutput> {
    return this.userService.deleteUser(username);
  }
}
