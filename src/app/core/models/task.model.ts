/**
 * 
 *  --- TASK DIFFICULTIES ---
 * 
 * Brainstorm Samples
Beginner
Intermediate
Advanced
Expert
Master 
 
Easy Win (Beginner)
Daily Grind (Intermediate)
Big Project (Advanced)
Hard Deadline (Expert)
Impossible Goal (Master)

Quick Fix (Beginner)
Steady Task (Intermediate)
Tough Challenge (Advanced)
Critical Mission (Expert)
Final Showdown (Master)
*/

export const TaskDifficulty = {
  Beginner: 'Beginner',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
  Expert: 'Expert',
  Master: 'Master',
} as const;
export const TaskDifficulties = Object.values(TaskDifficulty);
export type TaskDifficultyType =
  (typeof TaskDifficulty)[keyof typeof TaskDifficulty];

/**
 *  --- TASK STATUS ---
 */
export const TaskStatus = {
  Active: 'Active',
  Cancelled: 'Cancelled',
  Completed: 'Completed',
  Paused: 'Paused',
} as const;

export const TaskStatuses = Object.values(TaskStatus);
export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

/**
 *  --- TASK STAT ---
 */
export const TaskStat = {
  HpTotal: 'hpTotal',
  HpCurrent: 'hpCurrent',
  RewardGold: 'rewardGold',
  RewardXp: 'rewardXp',
} as const;
export const TaskStats = Object.values(TaskStat);
export type TaskStatType = (typeof TaskStat)[keyof typeof TaskStat];

export class Task {
  _id?: string;
  name?: string;
  description?: string;
  subtaskIds?: string[];
  status?: TaskStatusType;
  userLimit?: number;
  userIds?: string[];
  deadlineDatetime?: Date;
  difficulty?: TaskDifficultyType;
  stat?: Record<TaskStatType, number>;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(model: Partial<Task> = {}) {
    Object.assign(this, model);
  }
}
