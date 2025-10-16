import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ItemApiService } from './item/item.api.service';
import { TaskApiService } from './task/task.api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly auth = inject(AuthService);
  readonly task = inject(TaskApiService);
  readonly item = inject(ItemApiService);
}
