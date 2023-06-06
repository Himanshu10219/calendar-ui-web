import { UserModel } from './usermodel';

export interface UserGroup {
  id?: number;
  name: string;
  description: string;
  createBy: UserModel;
}
