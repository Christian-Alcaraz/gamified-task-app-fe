import { inject, Injectable } from '@angular/core';
import { Task, TaskTyping } from '@core/models/task.model';
import { HttpService } from '@shared/services/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private readonly httpService = inject(HttpService);
  private readonly url = '/tasks';

  createTask(task: Task) {
    return this.httpService.start<Task>('post', this.url, task);
  }

  updateTask(task: Task, taskId: string) {
    return this.httpService.start<Task>('put', `${this.url}/${taskId}`, task);
  }

  // deleteTask(taskId: string) {
  //   return this.httpService.start('delete', `${this.url}/${taskId}`);
  // }

  patchTaskCompletion(taskId: string, completed: boolean) {
    return this.httpService.start('patch', `${this.url}/${taskId}`, {
      completed,
    });
  }

  getTask(taskId: string) {
    return this.httpService.start<Task>('get', `${this.url}/${taskId}`);
  }
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTasks(type?: TaskTyping, query?: Record<string, any>) {
    query = query ?? {};

    if (type) {
      query = { ...query, type };
    }

    return this.httpService.start<Task[]>('get', this.url, {}, query);
  }
}
