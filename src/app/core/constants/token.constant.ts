export const Token = {
  Guard: 'GUARD_TOKEN',
  Auth: 'AUTH_TOKEN',
};

export const Tokens = Object.values(Token);
export type TokenType = (typeof Token)[keyof typeof Token];
