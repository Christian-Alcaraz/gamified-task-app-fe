import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'development',
  PRODUCTION: false,
  API_URL: 'http://localhost:3000/api/v1',
};

export const environment = {
  ...commonEnv,
  ...env,
};
