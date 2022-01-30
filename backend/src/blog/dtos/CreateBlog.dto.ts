import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  image_url: string;
}
