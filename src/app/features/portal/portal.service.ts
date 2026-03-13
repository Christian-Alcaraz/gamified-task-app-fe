import { Injectable } from '@angular/core';
import { INavItem } from '@core/interfaces/nav-item.interface';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  private _activeRoute!: INavItem;

  get activeRoute(): INavItem {
    return this._activeRoute;
  }

  set activeRoute(route: INavItem) {
    this._activeRoute = route;
  }
}
