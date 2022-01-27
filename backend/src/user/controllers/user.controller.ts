import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Role } from '../../auth/roles.enum';
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  findAll(@Req() req: any): Observable<PresenterOutput> {
    Logger.log('UserController-findAll user', req.user);

    return this.userService.findAll();
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  findUser(@Param('username') username: string): Observable<PresenterOutput> {
    return this.userService.findUserByName(username);
  }

  @Delete(':username')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  deleteUser(@Param('username') username: string): Observable<PresenterOutput> {
    return this.userService.deleteUser(username);
  }
}
