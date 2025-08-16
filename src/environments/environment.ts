import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'development',
  PRODUCTION: false,
  API_URL: 'http://localhost:8000/api/v1',
  EMAIL: 'gamified@taskapp.com',
  PASSWORD: 'Password123!',
};

export const environment = {
  ...commonEnv,
  ...env,
};
