import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Task } from '@core/models/task.model';
import { NgIcon } from '@ng-icons/core';
import { Checkbox } from '@shared/components/inputs/checkbox-field/checkbox';

@Component({
  selector: 'app-task-item',
  imports: [NgIcon, Checkbox, DatePipe],
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
            <ng-content select="[badges]"></ng-content>
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
        <div
          data-actions
          class="col-span-12 flex flex-col bg-foreground/10 group-hover:bg-muted border-t"
          [class.hidden]="!task().description && !task().deadlineDate"
        >
          @if (task().description) {
            <p class="inline-block text-sm text-muted-foreground px-4 py-2">
              {{ task().description }}
            </p>
          }

          @if (task().deadlineDate) {
            <p
              class="inline-flex items-center gap-2 text-xs text-muted-foreground px-4 pt-3 pb-3"
            >
              <ng-icon
                name="saxCalendar1Outline"
                class="[&>*]:fill-foreground"
              ></ng-icon>
              {{ task().deadlineDate | date: 'MMMM dd, yyyy' }}
            </p>
          }
        </div>
      </main>
    </div>
  `,
  standalone: true,
  styles: ``,
})
export class TaskItemComponent {
  readonly task = input.required<Task>();

  taskSelect = output<Task>();
  taskCompletionChange = output<boolean>();
  // Todo: Remove badgeConfig because we used content projection in task-list instead
}
