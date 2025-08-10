import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'production',
  PRODUCTION: true,
  API_URL: 'http://localhost:3000/v1',
};

export const environment = { ...env, ...commonEnv };
