import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UtilService } from '@shared/services/util/util.service';

@Component({
  selector: 'app-input-error',
  imports: [],
  templateUrl: './input-error.component.html',
  styleUrl: './input-error.component.scss',
})
export class InputErrorComponent implements OnInit {
  @Input({ required: true }) fControl!: FormControl;
  @Input() labelProps!: string | null | undefined;

  private readonly _utilService = inject(UtilService);

  errorMessage!: string;
  label!: string;

  ngOnInit(): void {
    this.label = this.labelProps || 'This field';

    const sentenceCaseRegex = /(?<=^|[.!?]\s)\w/g;
    this.fControl?.statusChanges.subscribe(() => {
      this.errorMessage = '';
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorList: any = {
        required: 'is required',
        email: 'is invalid format',
        max: 'has exceeded max number',
        maxlength: 'has exceeded max length',
        min: 'has exceeded min number',
        minlength: 'has exceeded min length',
        invalidenumvalue: 'must be valid',
        nan: 'must be a number',
        invaliddate: 'must be a date',
        expectedvaluetypeinvalid: 'has a invalid type/input.',
        passwordStrength:
          'must have atleast 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
        mustMatchWithControl: 'is not matched with {value}',
      };

      if (this.fControl?.errors) {
        const firstErrorKey = Object.keys(this.fControl.errors)[0];
        const firstErrorValue = Object.values(this.fControl.errors)[0];

        let firstErrorMessage = errorList[firstErrorKey];

        if (firstErrorMessage.includes('{value}')) {
          firstErrorMessage = this._utilService.string.replacePlaceholders(
            firstErrorMessage,
            { value: firstErrorValue },
          );
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
        this.errorMessage = `${this.label} ${firstErrorMessage}`.replace(
          sentenceCaseRegex,
          function (c) {
            return c.toUpperCase();
          },
        );
      }
    });
  }
}
