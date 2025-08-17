import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'production',
  PRODUCTION: true,
  API_URL: 'http://localhost:8000/v1',
  EMAIL: '',
  PASSWORD: '',
};

export const environment = { ...env, ...commonEnv };
