import { OutputDto } from 'src/core/output';

export class UserDto implements OutputDto {
  username: string;
  email: string;
  fullname: string;
  image_url: string;
  id: string;
}
