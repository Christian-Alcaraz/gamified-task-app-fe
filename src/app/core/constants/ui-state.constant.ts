export const UI_STATE = {
  Info: 'info',
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
  Loading: 'loading',
} as const;

export const UI_STATES = Object.values(UI_STATE);
export type IUiState = (typeof UI_STATE)[keyof typeof UI_STATE];
