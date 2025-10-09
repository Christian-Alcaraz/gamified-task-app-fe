import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UtilService } from '@shared/services/util/util.service';
import { merge, Subject, takeUntil } from 'rxjs';
import { InputService } from '../input.service';

@Component({
  selector: 'app-input-error',
  imports: [],
  templateUrl: './input-error.component.html',
  styleUrl: './input-error.component.scss',
})
export class InputErrorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) fControl!: FormControl;
  @Input() labelProps!: string | null | undefined;

  private readonly _utilService = inject(UtilService);
  private readonly _inputService = inject(InputService);
  private destroy$ = new Subject<void>();

  errorMessage = '';
  label!: string;

  ngOnInit(): void {
    this.label = this.labelProps || 'This field';

    merge(
      this.fControl?.statusChanges,
      this._inputService.manualValidationSource,
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this._createErrorMessage();
      });
  }

  private _createErrorMessage() {
    const sentenceCaseRegex = /(?<=^|[.!?]\s)\w/g;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorList: any = {
      required: 'is required',
      email: 'is invalid format',
      max: 'has exceeded max value (max: {value})',
      maxlength: 'has exceeded max length',
      min: 'has exceeded min value (min: {value})',
      minlength: 'has exceeded min length',
      invalidenumvalue: 'must be valid',
      nan: 'must be a number',
      invaliddate: 'must be a date',
      expectedvaluetypeinvalid: 'has a invalid type/input.',
      passwordStrength:
        'must have atleast 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
      mustMatchWithControl: 'is not matched with {value}',
      hasUppercase: 'must have atleast 1 uppercase letter',
      hasLowercase: 'must have atleast 1 lowercase letter',
      hasNumeric: 'must have atleast 1 number',
      mask: 'is invalid format',
    };

    if (this.fControl?.errors) {
      const firstErrorKey = Object.keys(this.fControl.errors)[0];
      const firstErrorValue = Object.values(this.fControl.errors)[0];

      let firstErrorMessage = errorList[firstErrorKey];

      if (firstErrorMessage?.includes('{value}')) {
        const { value, options } = this._getReplacementValueOpts(
          firstErrorKey,
          firstErrorValue,
        );

        firstErrorMessage = this._utilService.string.replacePlaceholders(
          firstErrorMessage,
          { value },
          options,
        );
      }

      this.errorMessage = `${this.label} ${firstErrorMessage}`.replace(
        sentenceCaseRegex,
        function (c) {
          return c.toUpperCase();
        },
      );
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private _getReplacementValueOpts(
    errorKey: string,
    errorValue: any,
  ): { value: any; options?: any } {
    const opts = {} as any;

    switch (errorKey) {
      case 'mustMatchWithControl': {
        opts['value'] = errorValue;
        opts['options'] = { toCapitalize: true };
        break;
      }
    }

    if (typeof errorValue === 'object') {
      opts['value'] = errorValue[errorKey];
    } else {
      opts['value'] = errorValue;
    }

    return opts;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// if (firstKey === 'serverError') {
//   const [errorCode, errorValue] =
//     this.fControl.errors[firstKey].split(':');
//   this.errorMessage = `${this.label} ${errorList[errorCode]}`.replace(
//     sentenceCaseRegex,
//     function (c) {
//       return c.toUpperCase();
//     },
//   );
//   return;
// }
