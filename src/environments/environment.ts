import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'development',
  PRODUCTION: false,
  API_URL: 'http://localhost:8000/api/v1',
  EMAIL: '',
  PASSWORD: '',
};

export const environment = {
  ...commonEnv,
  ...env,
};
