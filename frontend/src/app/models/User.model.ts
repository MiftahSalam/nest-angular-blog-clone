import { UserRole } from './Role.model';

export interface UserModel {
  id: string;
  username: string;
  fullname?: string;
  image_url?: string;
  email?: string;
  role: UserRole;
  createdAt: Date;
}
