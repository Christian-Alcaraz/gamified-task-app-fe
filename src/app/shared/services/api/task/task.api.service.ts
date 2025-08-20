import { inject, Injectable } from '@angular/core';
import { Task, TaskTyping } from '@core/models/task.model';
import { HttpService } from '@shared/services/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly httpService = inject(HttpService);

  createTask(task: Task) {
    return this.httpService.start<Task>('post', '/tasks', task);
  }

  updateTask(task: Task, taskId: string) {
    return this.httpService.start<Task>('put', `/tasks/${taskId}`, task);
  }

  // deleteTask(taskId: string) {
  //   return this.httpService.start('delete', `/tasks/${taskId}`);
  // }

  patchTaskCompletion(taskId: string, completed: boolean) {
    return this.httpService.start('patch', `/tasks/${taskId}`, { completed });
  }

  getTask(taskId: string) {
    return this.httpService.start<Task>('get', `/tasks/${taskId}`);
  }

  getTasks(type?: TaskTyping) {
    let query = {};

    if (type) {
      query = { type };
    }

    return this.httpService.start<Task[]>('get', '/tasks', {}, query);
  }
}
