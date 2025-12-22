// --- TASK Frequency for Dailies ---
export enum ETaskFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}
export const ETaskFrequencies = Object.values(ETaskFrequency);

// --- TASK Difficulty ---
export enum ETaskDifficulty {
  Trivial = 'trivial',
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}
export const ETaskDifficulties = Object.values(ETaskDifficulty);

//  --- TASK STATUS ---
export enum ETaskStatus {
  Active = 'active',
  Cancelled = 'cancelled',
  Completed = 'completed',
  Paused = 'paused',
}

export const ETaskStatuses = Object.values(ETaskStatus);

// --- TASK STAT ---
export enum ETaskStat {
  HpTotal = 'hpTotal',
  HpCurrent = 'hpCurrent',
  RewardGold = 'rewardGold',
  RewardXp = 'rewardXp',
}
export const ETaskStats = Object.values(ETaskStat);

// --- TASK TYPE ---
export enum ETaskType {
  Dailies = 'dailies',
  Todo = 'todo',
}
export const ETaskTypes = Object.values(ETaskType);

interface ISubtask {
  _id: string;
  name: string;
  completed: boolean;
}

export interface ITaskReward {
  gold: number;
  experience: number;
}

export class Task {
  _id?: string;
  name?: string;
  description?: string;
  type?: ETaskType;
  subtasks?: ISubtask[];
  completed?: boolean;
  userLimit?: number;
  deadlineDate?: Date;
  difficulty?: ETaskDifficulty;
  frequency?: ETaskFrequency;
  streak?: number;
  stat?: Record<ETaskStat, number>;
  _userId?: string;
  rewardGranted?: ITaskReward;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: Partial<Task> = {}) {
    Object.assign(this, model);
  }
}
