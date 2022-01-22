import { OutputDto } from 'src/core/output';

export interface CreateUserOutput extends OutputDto {
  id: string;
  username: string;
  fullname: string;
  image_url: string;
  email: string;
}
