export const Color = {
  Primary: 'primary',
  Error: 'error',
  Warning: 'warning',
  Success: 'success',
  Neutral: 'neutral',
} as const;

export const Colors = Object.keys(Color);

export type ColorType = (typeof Color)[keyof typeof Color];
