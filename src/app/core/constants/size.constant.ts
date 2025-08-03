export const Size = {
  ExtraLarge: 'xl',
  Large: 'lg',
  Medium: 'md',
  Small: 'sm',
  ExtraSmall: 'xs',
};

export const Sizes = Object.keys(Size);

export type SizeType = (typeof Size)[keyof typeof Size];
