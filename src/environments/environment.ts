import { EnvName } from './environment.enum';

const scheme = 'http://';
const host = 'localhost';
const port = ':8080';
const path = '/api/';

const baseUrl = scheme + host + port + path;

export const environment = {
  production: false,
  appName: 'Calendrify',
  envName: EnvName.LOCAL,
  defaultLanguage: 'en',
  apiBaseUrl: baseUrl,
};