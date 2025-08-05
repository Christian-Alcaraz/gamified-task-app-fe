export const Status = {
  Active: 'Active',
  Inactive: 'Inactive',
  Deleted: 'Deleted',
} as const;

export const Statuses = Object.values(Status);
export type StatusTyping = (typeof Status)[keyof typeof Status];
