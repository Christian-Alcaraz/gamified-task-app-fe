// Constants
const Frequency = {
  Daily: 'daily',
  Weekly: 'weekly',
  Monthly: 'monthly',
  Yearly: 'yearly',
} as const;

const Difficulty = {
  Trivial: 'trivial',
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
} as const;

const Status = {
  Active: 'active',
  Cancelled: 'cancelled',
  Completed: 'completed',
  Paused: 'paused',
} as const;

const Stat = {
  HpTotal: 'hpTotal',
  HpCurrent: 'hpCurrent',
  RewardGold: 'rewardGold',
  RewardXp: 'rewardXp',
} as const;

const Type = {
  Dailies: 'dailies',
  Todo: 'todo',
} as const;

// Lists
const Frequencies = Object.values(Frequency);
const Difficulties = Object.values(Difficulty);
const Statuses = Object.values(Status);
const Stats = Object.values(Stat);
const Types = Object.values(Type);

export const Task = {
  Frequency,
  Frequencies,
  Difficulty,
  Difficulties,
  Status,
  Statuses,
  Stat,
  Stats,
  Type,
  Types,
};

// Typings
export type TaskFrequencyType = (typeof Frequency)[keyof typeof Frequency];
export type TaskDifficultyType = (typeof Difficulty)[keyof typeof Difficulty];
export type TaskStatusType = (typeof Status)[keyof typeof Status];
export type TaskStatType = (typeof Stat)[keyof typeof Stat];
export type TaskType = (typeof Type)[keyof typeof Type];
