import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function valueMustMatchWithControlName(
  matchingFormControl: FormControl,
  matchingFormControlName: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlValue = control.value;
    const matchingValue = matchingFormControl.value;

    if (!controlValue) {
      return null;
    }

    return controlValue === matchingValue
      ? null
      : { mustMatchWithControl: matchingFormControlName };
  };
}

export function atleastHasOneUppercase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    return !/[A-Z]+/.test(value) ? { hasUppercase: false } : null;
  };
}

export function atleastHasOneLowercase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    return !/[a-z]+/.test(value) ? { hasLowercase: false } : null;
  };
}

export function atleastHasOneNumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    return !/[0-9]+/.test(value) ? { hasNumeric: false } : null;
  };
}
