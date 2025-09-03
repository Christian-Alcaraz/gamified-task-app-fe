import { environment } from 'src/environments/environment';

export abstract class BaseApiService {
  protected readonly baseUrl = environment.API_URL;
}
