const portalNavHeaderItems = [
  {
    label: 'Tasks',
    route: '/hub/tasks',
  },
  // {
  //   label: 'Party',
  //   route: '/hub/party',
  // },
];

const Const = {
  AppTheme: 'app-theme',
  NavItems: portalNavHeaderItems,
} as const;

export * from './base.constant';
export * from './color.constant';
export * from './item.constant';
export * from './size.constant';
export * from './status.constant';
export * from './token.constant';
export * from './userType.constant';
export { Const };
