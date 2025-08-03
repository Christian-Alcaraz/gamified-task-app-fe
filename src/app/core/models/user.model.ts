import { StatusType } from '@core/constants/status.constant';

export type UserType = 'User' | 'Admin';

export class User {
  _id?: string;
  email?: string;
  userType?: UserType;
  status?: StatusType;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: Partial<User> = {}) {
    Object.assign(this, model);
  }
}
