export const Size = {
  ExtraLarge: 'xl',
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
  ExtraSmall: 'xs',
};

export const Sizes = Object.keys(Size);
export type SizeTyping = (typeof Size)[keyof typeof Size];
