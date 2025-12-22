import { environment } from 'src/environments/environment';

export interface IPaginatedResponse<T> {
  records: T[];
  total: number;
}

export abstract class BaseApiService {
  protected readonly baseUrl = environment.API_URL;
}
