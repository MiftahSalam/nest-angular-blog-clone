import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateBlogDto } from './CreateBlog.dto';

export class UpdateBlogDto extends CreateBlogDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
