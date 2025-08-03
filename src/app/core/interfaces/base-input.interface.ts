export interface BaseInputProps {
  label?: string;
  placeholder?: string;
  fcName?: string;
  hint?: string;
  validators?: ValidatorType;
}

export interface ValidatorType {
  required?: boolean;
  email?: boolean;
  max?: number;
  maxLength?: number;
  min?: number;
  minLength?: number;
  passwordStrength?: boolean;
  mustMatchWithControl?: string;
}
