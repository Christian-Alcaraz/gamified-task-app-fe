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

export function atleastHasOneUppercase(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  return !/[A-Z]+/.test(value) ? { hasUppercase: true } : null;
}

export function atleastHasOneLowercase(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  return !/[a-z]+/.test(value) ? { hasLowercase: true } : null;
}

export function atleastHasOneNumeric(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  return !/[0-9]+/.test(value) ? { hasNumeric: true } : null;
}
