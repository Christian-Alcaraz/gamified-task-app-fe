// --- TASK Frequency for Dailies ---
export const TaskFrequency = {
  Daily: 'daily',
  Weekly: 'weekly',
  Monthly: 'monthly',
  Yearly: 'yearly',
} as const;
export const TaskFrequencies = Object.values(TaskFrequency);
export type TaskFrequencyTyping =
  (typeof TaskFrequency)[keyof typeof TaskFrequency];

// --- TASK Difficulty ---
export const TaskDifficulty = {
  Trivial: 'trivial',
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
} as const;
export const TaskDifficulties = Object.values(TaskDifficulty);
export type TaskDifficultyTyping =
  (typeof TaskDifficulty)[keyof typeof TaskDifficulty];

//  --- TASK STATUS ---
export const TaskStatus = {
  Active: 'active',
  Cancelled: 'cancelled',
  Completed: 'completed',
  Paused: 'paused',
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

// --- TASK TYPE ---
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
  subtasks?: string[];
  status?: TaskStatusTyping;
  userLimit?: number;
  userIds?: string[];
  deadlineDate?: Date;
  difficulty?: TaskDifficultyTyping;
  stat?: Record<TaskStatTyping, number>;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: Partial<Task> = {}) {
    Object.assign(this, model);
  }
}
