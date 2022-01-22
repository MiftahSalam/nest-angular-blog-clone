import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  fullname: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  image_url: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
