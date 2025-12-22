import {
  computed,
  inject,
  Injectable,
  InjectionToken,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ETaskType, Task } from '@core/models/task.model';
import {
  combineLatest,
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

export enum ETaskStateStatus {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}
export interface ITasksState {
  tasks: Signal<Task[]>;
  filter: Signal<string | null>;
  error: Signal<string | null>;
  status: Signal<ETaskStateStatus>;
}

export const DailiesTaskStateInstance = new InjectionToken<TaskStateService>(
  'dailiesTaskState',
);
export const TodoTaskStateInstance = new InjectionToken<TaskStateService>(
  'todoTaskState',
);

export function DailiesTaskStateFactory(): TaskStateService {
  const service = new TaskStateService();
  service.taskType$.next(ETaskType.Dailies);
  return service;
}

export function TodoTaskStateFactory(): TaskStateService {
  const service = new TaskStateService();
  service.taskType$.next(ETaskType.Todo);
  service.query$.next({ completed: false });
  return service;
}

@Injectable({
  providedIn: 'root',
})
export class TaskStateService {
  //Todo: have a method that initializes the service with a task type and optional query
  /**
   * init(taskType: ETaskType, query?: Record<string, any>) {
   *  this.taskType$.next(taskType);
   *  if (query) {
   *    this.query$.next(query);
   * }
   * }
   */
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
      this.apiService.getTasks(taskType as ETaskType, taskQuery as any).pipe(
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

  private status$ = merge(
    this.tasks$.pipe(map(() => ETaskStateStatus.Success)),
    merge(this.taskType$, this.retry$, this.query$).pipe(
      map(() => ETaskStateStatus.Loading),
    ),
    this.error$.pipe(map(() => ETaskStateStatus.Error)),
  );

  // selectors
  // private currentPage = toSignal(this.currentPage$, { initialValue: 1 });
  private tasks = toSignal(this.tasks$, { initialValue: [] });
  private filter = toSignal(this.filter$, { initialValue: null });
  private error = toSignal(this.error$.pipe(map((err) => err.message)), {
    initialValue: null,
  });
  private status = toSignal(this.status$, {
    initialValue: ETaskStateStatus.Loading,
  });

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
  public state: ITasksState = {
    tasks: this.filteredTasks,
    filter: this.filter,
    error: this.error,
    status: this.status,
  };
}
