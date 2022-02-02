import { UserModel } from './User.model';

export interface BlogModel {
  id: string;
  title: string;
  slug?: string;
  image_url?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  content?: string;
  author?: Partial<UserModel>;
}
