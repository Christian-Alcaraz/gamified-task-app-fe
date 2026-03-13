import { INavItem } from '@core/interfaces/nav-item.interface';

export * from './base.constant';
export * from './color.constant';
export * from './item.constant';
export * from './size.constant';
export * from './status.constant';
export * from './token.constant';
export * from './ui-state.constant';
export * from './userType.constant';
export * from './websocket.constant';

export enum EPortalNavTitles {
  Tasks = 'Tasks',
  Party = 'Party',
  Shop = 'Shop',
}

export enum EPortalNavRouteName {
  Tasks = 'tasks',
  Party = 'party',
  Shop = 'shop',
}

export enum EPortalNavRouteUrl {
  Tasks = '/hub/tasks',
  Party = '/hub/party',
  Shop = '/hub/shop',
}

export const EPortalSetting = 'portal';

export const PORTAL_NAV_HEADER_ITEMS: INavItem[] = [
  {
    title: EPortalNavTitles.Tasks,
    route: EPortalNavRouteUrl[EPortalNavTitles.Tasks],
  },
  {
    title: EPortalNavTitles.Party,
    route: EPortalNavRouteUrl[EPortalNavTitles.Party],
  },
  {
    title: EPortalNavTitles.Shop,
    route: EPortalNavRouteUrl[EPortalNavTitles.Shop],
  },
];

export const APP_THEME = 'app-theme';
