import { StatusTyping } from '@core/constants/status.constant';

export type UserTyping = 'User' | 'Admin';

export class User {
  _id?: string;
  email?: string;
  userType?: UserTyping;
  status?: StatusTyping;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: Partial<User> = {}) {
    Object.assign(this, model);
  }
}
