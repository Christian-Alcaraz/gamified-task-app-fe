export interface IBaseInputProps {
  label?: string;
  placeholder?: string;
  fcName?: string;
  hint?: string;
  validators?: IValidator;
  hideError?: boolean;
}

export interface IValidator {
  required?: boolean;
  email?: boolean;
  max?: number;
  maxLength?: number;
  min?: number;
  minLength?: number;
  passwordStrength?: boolean;
  mustMatchWithControl?: string;
  atleastHasOneUppercase?: boolean;
  atleastHasOneLowercase?: boolean;
  atleastHasOneNumeric?: boolean;
}
