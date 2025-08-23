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
  retry,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { TaskApiService } from '../api/task/task.api.service';

export type TaskStateStatus = 'loading' | 'success' | 'error';
export interface TasksState {
  tasks: Signal<Task[]>;
  filter: Signal<string | null>;
  error: Signal<string | null>;
  status: Signal<TaskStateStatus>;
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
  service.query$.next({ completed: false });
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
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  public query$ = new Subject<Record<string, any>>();
  private error$ = new Subject<Error>();

  /* eslint-disable */
  private tasks$: Observable<Task[]> = combineLatest([
    this.taskType$,
    this.query$.pipe(startWith({})),
    this.retry$.pipe(startWith(null)),
  ]).pipe(
    switchMap(([taskType, taskQuery]) =>
      this.apiService.getTasks(taskType as TaskTyping, taskQuery as any).pipe(
        retry({
          delay: (error) => {
            this.error$.next(error);
            return this.retry$;
          },
        }),
        startWith([]),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  /* eslint-enable */

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

    if (!filter) {
      return this.tasks();
    }

    return this.tasks().filter((task) =>
      task.name!.toLowerCase().includes(filter.toLowerCase()),
    );
  });

  // state
  public state: TasksState = {
    tasks: this.filteredTasks,
    filter: this.filter,
    error: this.error,
    status: this.status,
  };
}
