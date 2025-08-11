import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { ThemeService } from '@shared/services/theme/theme.service';
import { UtilService } from '@shared/services/util/util.service';
import { startWith, Subject, takeUntil } from 'rxjs';
import { BaseInput } from '../base-input.class';
import { InputErrorComponent } from '../input-error/input-error.component';
@Component({
  selector: 'app-select-field',
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent, NgIcon],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss',
})
export class SelectFieldComponent
  extends BaseInput
  implements OnInit, OnDestroy
{
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<unknown>;
  @ViewChild('triggerInput', { read: ElementRef })
  triggerInput!: ElementRef<HTMLButtonElement>;

  /* eslint-disable */
  @Input() props!: any;
  @Input() fcName!: string;
  @Input() options!: any[];
  @Input() disabled = false;
  /* eslint-enable  */

  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly utilString = inject(UtilService).string;

  private destroyed$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;
  private focusTrap?: FocusTrap;

  readonly theme = inject(ThemeService).theme();

  searchOptionControl = new FormControl('');
  displayControl = new FormControl('');

  overlayRef?: OverlayRef;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  filteredOptions!: any[];

  isDropdownOpen = signal(false);

  openDropdown() {
    if (this.overlayRef) return;
    if (this.disabled) return;

    this.isDropdownOpen.set(true);

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.triggerInput)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: this.triggerInput.nativeElement.offsetWidth,
    });

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.closeDropdown());

    this.overlayRef.attach(
      new TemplatePortal(this.dropdownTemplate, this.viewContainerRef),
    );

    this.updateOverlayWidth();
    this.startResizeTracking();

    const dropdownElement = this.overlayRef.overlayElement;
    this.focusTrap = this.focusTrapFactory.create(dropdownElement);
    this.focusTrap.focusInitialElement();
  }

  selectOption(option: string) {
    this.fControl.setValue(option);
    this.searchOptionControl.setValue('');
    this.fControl.markAsTouched();
    this.fControl.markAsDirty();
    this.closeDropdown();
  }

  closeDropdown() {
    this.stopResizeTracking();
    this.isDropdownOpen.set(false);

    if (this.focusTrap) {
      this.focusTrap.destroy();
    }

    if (this.overlayRef) {
      this.overlayRef!.dispose();
      this.overlayRef = undefined;
    }
  }
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  isSameWithDisplayValue(value: any) {
    return (
      this.displayWith(value) === this.displayWith(this.displayControl.value)
    );
  }

  ngOnInit(): void {
    this.fcName = this.fcName ?? this.props.fcName;
    this.initFormControl(this.fcName as string, this.props.validators);

    this.setDisplayValue();

    this.fControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.setDisplayValue();
      });

    this.searchOptionControl.valueChanges
      .pipe(startWith(''), takeUntil(this.destroyed$))
      .subscribe((value) => {
        this._searchFn(value as string);
      });
  }
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayWith(option: any) {
    let displayStr = option;

    if (typeof option === 'object') {
      const key = this.props.displayKey ?? 'label';
      displayStr = option[key];
    }
    return displayStr ? this.utilString.toTitleCase(displayStr) : '';
  }

  private setDisplayValue() {
    const formatted = this.displayWith(this.fControl.value);
    this.displayControl.setValue(this.displayWith(formatted));
  }

  get showError(): boolean {
    return this.props?.hideError
      ? false
      : !!this.fControl.errors &&
          (this.fControl.dirty || this.fControl.touched);
  }

  get showHint(): boolean {
    return (
      this.props?.hint &&
      (this.fControl.pristine ? true : !this.fControl.errors)
    );
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _searchFn(value: any) {
    if (this.props.searchFn) {
      console.assert(
        typeof this.props.searchFn === 'function',
        'searchFn must be a function',
      );
      this.filteredOptions = this.props.searchFn(value);
    } else {
      this.filteredOptions = this.options.filter((opt) =>
        this.displayWith(opt)
          .toLowerCase()
          .includes(this.displayWith(value).toLowerCase()),
      );
    }
  }

  private updateOverlayWidth() {
    if (!this.overlayRef) return;
    const parentWidth =
      this.triggerInput.nativeElement.parentElement?.offsetWidth || 0;
    const overlayPane = this.overlayRef.overlayElement;
    overlayPane.style.width = `${parentWidth}px`;
  }

  private startResizeTracking() {
    const parentEl = this.triggerInput.nativeElement.parentElement;
    if (!parentEl) return;

    this.stopResizeTracking();

    this.resizeObserver = new ResizeObserver(() => {
      this.updateOverlayWidth();
    });
    this.resizeObserver.observe(parentEl);

    window.addEventListener('resize', () => this.updateOverlayWidth());
  }

  private stopResizeTracking() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    window.removeEventListener('resize', () => this.updateOverlayWidth());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
