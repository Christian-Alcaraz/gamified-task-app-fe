export enum ETaskFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum ETaskDifficulty {
  Trivial = 'trivial',
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum ETaskStatus {
  Active = 'active',
  Cancelled = 'cancelled',
  Completed = 'completed',
  Paused = 'paused',
}

export enum ETaskStat {
  HpTotal = 'hpTotal',
  HpCurrent = 'hpCurrent',
  RewardGold = 'rewardGold',
  RewardXp = 'rewardXp',
}

export enum ETaskType {
  Dailies = 'dailies',
  Todo = 'todo',
}

// Lists
export const TASK_FREQUENCIES = Object.values(ETaskFrequency);
export const TASK_DIFFICULTIES = Object.values(ETaskDifficulty);
export const TASK_STATUSES = Object.values(ETaskStatus);
export const TASK_STATS = Object.values(ETaskStat);
export const TASK_TYPES = Object.values(ETaskType);
