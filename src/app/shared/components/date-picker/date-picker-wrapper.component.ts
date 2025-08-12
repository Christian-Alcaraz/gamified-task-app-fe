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
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { ThemeService } from '@shared/services/theme/theme.service';
import { UtilService } from '@shared/services/util/util.service';
import { Subject, takeUntil } from 'rxjs';
import { BaseInput, InputErrorComponent } from '../inputs';
import { DatePicker } from './components/date-picker.component';

@Component({
  selector: 'app-date-picker',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePicker,
    InputErrorComponent,
    NgIcon,
  ],
  standalone: true,
  styles: ``,
  templateUrl: './date-picker-wrapper.component.html',
})
export class DatePickerComponent extends BaseInput implements OnInit {
  @ViewChild('triggerInput', { read: ElementRef })
  triggerInput!: ElementRef<HTMLInputElement>;
  @ViewChild('datePicker')
  datePicker!: TemplateRef<unknown>;

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
  private readonly utilDate = inject(UtilService).date;
  private readonly utilString = inject(UtilService).string;

  // private readonly utilString = inject(UtilService).string;

  readonly theme = inject(ThemeService).theme();

  private destroyed$ = new Subject<void>();
  private resizeObserver?: ResizeObserver;
  private focusTrap?: FocusTrap;
  private overlayRef?: OverlayRef;

  displayControl = new FormControl('');

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

  ngOnInit(): void {
    this.fcName = this.fcName ?? this.props.fcName;
    console.assert(!!this.fcName, 'fcName must be provided');

    this.initFormControl(this.fcName as string, this.props.validators);

    this.setDisplayValue();

    this.fControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.setDisplayValue();
      });
  }

  openDropdown() {
    if (this.overlayRef) return;
    if (this.disabled) return;

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
      minWidth: 0,
      maxWidth: 0,
    });

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.closeDropdown());

    this.overlayRef.attach(
      new TemplatePortal(this.datePicker, this.viewContainerRef),
    );

    this.updateOverlayWidth();
    this.startResizeTracking();

    const dropdownElement = this.overlayRef.overlayElement;
    this.focusTrap = this.focusTrapFactory.create(dropdownElement);
    this.focusTrap.focusInitialElement();
  }

  setDisplayValue() {
    if (!this.fControl.value) return;

    const formatted = this.utilDate.formatDate(this.fControl.value);
    this.displayControl.setValue(formatted);
  }

  updateValue(date: Date) {
    this.fControl.setValue(date);
    this.closeDropdown();
  }

  private closeDropdown() {
    this.stopResizeTracking();

    if (this.focusTrap) {
      this.focusTrap.destroy();
    }

    if (this.overlayRef) {
      this.overlayRef!.dispose();
      this.overlayRef = undefined;
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
}
