import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, computed, HostBinding, inject } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';

@Component({
  selector: 'app-upsert-task-modal',
  imports: [],
  templateUrl: './upsert-task-modal.component.html',
  styleUrl: './upsert-task-modal.component.scss',
})
export class UpsertTaskModalComponent extends ThemeAwareComponent {
  // Todo: Make modal props or maybe ModalClassComponent?
  public readonly data = inject(DIALOG_DATA);

  private readonly _computedClass = computed(() =>
    [
      this.theme() === 'dark' ? 'dark' : '',
      'relative bg-background justify-self-center z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg duration-100 sm:max-w-lg',
      this.data?.class ?? '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  @HostBinding('class')
  public get computedClass(): string {
    return this._computedClass();
  }

  constructor() {
    super();
  }
}
