import { Task, TaskType } from '@core/models/task.model';

export const formatTaskRequestBody = (task: Task) => {
  const body = JSON.parse(JSON.stringify(task));

  if (task._id) {
    delete body._id;
  }

  if (task._userId) {
    delete body._userId;
  }

  if (task.createdAt) {
    delete body.createdAt;
  }

  if (task.updatedAt) {
    delete body.updatedAt;
  }

  if (task.type === TaskType.Dailies) {
    delete body.deadlineDate;
  } else {
    delete body.frequency;
  }

  delete body.__v;
  return body;
};
