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

// interface ISubtask {
//   _id: string;
//   name: string;
//   completed: boolean;
// }

export interface ITaskReward {
  gold: number;
  experience: number;
}

export interface ITaskHistory {
  date: number;
  completed: boolean;
  isDue: boolean;
  value: number;
}

export class Task {
  _id: string;
  name: string;
  description?: string;
  type: ETaskType;
  completed: boolean;
  deadlineDate?: Date;
  difficulty?: ETaskDifficulty;
  frequency?: ETaskFrequency;
  streak?: number;
  stat?: Record<ETaskStat, number>;
  _userId?: string;
  rewardGranted?: ITaskReward;
  // subtasks?: ISubtask[];
  // userLimit?: number;

  history?: ITaskHistory[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: Task) {
    this._id = model._id;
    this.name = model.name;
    this.description = model.description;
    this.type = model.type;
    this.completed = model.completed;
    this.deadlineDate = model.deadlineDate;
    this.difficulty = model.difficulty;
    this.frequency = model.frequency;
    this.streak = model.streak;
    this.stat = model.stat;
    this._userId = model._userId;
    this.rewardGranted = model.rewardGranted;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this.history = model.history;
  }
}
