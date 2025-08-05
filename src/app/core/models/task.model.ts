export const TaskDifficulty = {
  Beginner: 'Beginner',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
  Expert: 'Expert',
  Master: 'Master',
} as const;
export const TaskDifficulties = Object.values(TaskDifficulty);
export type TaskDifficultyTyping =
  (typeof TaskDifficulty)[keyof typeof TaskDifficulty];

//  --- TASK STATUS ---
export const TaskStatus = {
  Active: 'Active',
  Cancelled: 'Cancelled',
  Completed: 'Completed',
  Paused: 'Paused',
} as const;

export const TaskStatuses = Object.values(TaskStatus);
export type TaskStatusTyping = (typeof TaskStatus)[keyof typeof TaskStatus];

// --- TASK STAT ---
export const TaskStat = {
  HpTotal: 'hpTotal',
  HpCurrent: 'hpCurrent',
  RewardGold: 'rewardGold',
  RewardXp: 'rewardXp',
} as const;
export const TaskStats = Object.values(TaskStat);
export type TaskStatTyping = (typeof TaskStat)[keyof typeof TaskStat];

export const TaskType = {
  Dailies: 'dailies',
  Todo: 'todo',
} as const;

export const TaskTypes = Object.values(TaskType);
export type TaskTyping = (typeof TaskType)[keyof typeof TaskType];

export class Task {
  _id?: string;
  name?: string;
  description?: string;
  type?: TaskTyping;
  subtaskIds?: string[];
  status?: TaskStatusTyping;
  userLimit?: number;
  userIds?: string[];
  deadlineDatetime?: Date;
  difficulty?: TaskDifficultyTyping;
  stat?: Record<TaskStatTyping, number>;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: Partial<Task> = {}) {
    Object.assign(this, model);
  }
}
