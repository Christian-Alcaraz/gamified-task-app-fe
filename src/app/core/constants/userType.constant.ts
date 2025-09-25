export const UserType = {
  User: 'User',
  Admin: 'Admin',
};

export const UserTypes = Object.values(UserType);
export type UserTyping = (typeof UserType)[keyof typeof UserType];
