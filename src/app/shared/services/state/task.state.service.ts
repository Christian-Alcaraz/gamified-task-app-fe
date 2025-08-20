import {
  computed,
  inject,
  Injectable,
  InjectionToken,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { Task, TaskType, TaskTyping } from '@core/models/task.model';
import {
  combineLatest,
  filter,
  map,
  merge,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { TaskApiService } from '../api/task/task.api.service';

export interface TasksState {
  tasks: Signal<Task[]>;
  filter: Signal<string | null>;
  error: Signal<string | null>;
  state: Signal<'loading' | 'success' | 'error'>;
}

export const DailiesTaskStateInstance = new InjectionToken<TaskStateService>(
  'dailiesTaskState',
);
export const TodoTaskStateInstance = new InjectionToken<TaskStateService>(
  'todoTaskState',
);

export function DailiesTaskStateFactory(): TaskStateService {
  const service = new TaskStateService();
  service.taskType$.next(TaskType.Dailies);
  return service;
}

export function TodoTaskStateFactory(): TaskStateService {
  const service = new TaskStateService();
  service.taskType$.next(TaskType.Todo);
  return service;
}

@Injectable({
  providedIn: 'root',
})
export class TaskStateService {
  // Todo: Replace retry$ to refresh$ and still explore this pattern

  private apiService = inject(TaskApiService);
  public filterControl = new FormControl('');

  // sources
  public retry$ = new Subject<void>();
  public taskType$ = new Subject<string>();
  private error$ = new Subject<Error>();

  private tasks$: Observable<Task[]> = combineLatest([
    this.taskType$,
    this.retry$.pipe(startWith(null)),
  ]).pipe(
    switchMap(([taskType]) =>
      this.apiService.getTasks(taskType as TaskTyping).pipe(startWith([])),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private filter$ = this.filterControl.valueChanges.pipe(
    map((filter) => filter || null),
  );

  // note
  private status$ = merge(
    this.tasks$.pipe(
      filter((task) => task.length > 0),
      map(() => 'success' as const),
    ),
    merge(this.taskType$, this.retry$).pipe(map(() => 'loading' as const)),
    this.error$.pipe(map(() => 'error' as const)),
  );

  // selectors
  // private currentPage = toSignal(this.currentPage$, { initialValue: 1 });
  private tasks = toSignal(this.tasks$, { initialValue: [] });
  private filter = toSignal(this.filter$, { initialValue: null });
  private error = toSignal(this.error$.pipe(map((err) => err.message)), {
    initialValue: null,
  });
  private status = toSignal(this.status$, { initialValue: 'loading' });

  private filteredTasks = computed(() => {
    const filter = this.filter();

    return filter
      ? this.tasks().filter((task) =>
          task.name!.toLowerCase().includes(filter.toLowerCase()),
        )
      : this.tasks();
  });

  // state
  public state: TasksState = {
    tasks: this.filteredTasks,
    filter: this.filter,
    error: this.error,
    state: this.status,
  };
}
