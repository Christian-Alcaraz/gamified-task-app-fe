import { Component, computed, input, output } from '@angular/core';
import { Task } from '@core/models/task.model';
import { NgIcon } from '@ng-icons/core';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { Checkbox } from '@shared/components/inputs/checkbox-field/checkbox';

@Component({
  selector: 'app-task-item',
  imports: [NgIcon, BadgeComponent, Checkbox],
  template: `
    <div
      class="grid grid-cols-12 border rounded-xl mt-2 bg-card overflow-hidden"
    >
      <aside class="bg-card col-span-1 flex items-center justify-center">
        <checkbox
          [checked]="task().completed"
          (checkedChange)="taskCompletionChange.emit($event)"
        ></checkbox>
      </aside>
      <main class="group col-span-11 grid grid-cols-12 border-l">
        <div
          class="col-span-12 flex items-center px-4 py-2 group-hover:bg-muted"
        >
          <h4
            class="inline-flex flex-1 items-center font-medium text-foreground overflow-x-hidden mr-1"
          >
            <button
              class="text-start text-sm hover:underline hover:text-accent cursor-pointer"
              (click)="taskSelect.emit(task())"
            >
              {{ task().name }}
            </button>
          </h4>

          <section class="inline-flex items-center gap-2">
            <app-badge [badgeValue]="task().difficulty!"></app-badge>
          </section>
          <button
            class="group/more transition-colors cursor-pointer duration-150 ease-out flex items-center justify-center min-w-[32px] min-h-[32px] h-[32px] w-[32px] ml-4 rounded-sm bg-transparent hover:bg-accent"
            (click)="taskSelect.emit(task())"
          >
            <ng-icon
              name="saxMoreOutline"
              class="rotate-90 [&>*]:fill-foreground group-hover/more:[&>*]:fill-background"
            ></ng-icon>
          </button>
        </div>
        @if (task().description) {
          <div
            data-actions
            class="col-span-12 flex items-center bg-foreground/10 group-hover:bg-muted border-t px-4 pt-2 pb-3"
          >
            <p class="text-xs text-muted-foreground">
              {{ task().description }}
            </p>
          </div>
        }
      </main>
    </div>
  `,
  styles: ``,
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly badgeConfig = input();

  readonly resolvedConfig = computed(() => this.badgeConfig() ?? null);

  taskSelect = output<Task>();
  taskCompletionChange = output<boolean>();
  // Todo: Menu Trigger for right-most button
  // menuSelect = output();
}
