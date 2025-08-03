import { Injectable, signal } from '@angular/core';
import { Task } from '@core/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskStateService {
  private _taskList = signal<Task[]>([]);
  readonly taskList = this._taskList.asReadonly();

  pinnedTask!: Task;
}
