export const Status = {
  Active: 'Active',
  Inactive: 'Inactive',
  Deleted: 'Deleted',
} as const;

export const Statuses = Object.values(Status);
export type StatusType = (typeof Status)[keyof typeof Status];
