import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'development',
  PRODUCTION: false,
  API_URL: 'http://localhost:8000/api/v1',
  WS_URL: 'http://localhost:8000',
  EMAIL: 'gamified@taskapp.com', //Todo: Delete this in deployment
  PASSWORD: 'Password123!', //Todo: Delete this in deployment
};

export const environment = {
  ...commonEnv,
  ...env,
};
