export const UIState = {
  Info: 'info',
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
  Loading: 'loading',
} as const;

export const UIStates = Object.values(UIState);
export type UIStateTyping = (typeof UIState)[keyof typeof UIState];
