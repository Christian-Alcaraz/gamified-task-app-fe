export const Token = {
  Guard: 'GUARD_TOKEN',
  Auth: 'AUTH_TOKEN',
  Refresh: 'REFRESH_TOKEN',
} as const;

export const Tokens = Object.values(Token);
export type TokenType = (typeof Token)[keyof typeof Token];
