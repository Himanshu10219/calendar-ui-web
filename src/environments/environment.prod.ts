// Enums
import { EnvName } from "./environment.enum";

// Packages

const scheme = 'http://';
const host = 'localhost';
const port = ':8080';
const path = '/api/';
const baseUrl = scheme + host + port + path;

export const environment = {
  production: true,
  appName: 'Calendrify',
  envName: EnvName.PROD,
  defaultLanguage: 'en',
  apiBaseUrl: baseUrl,
};
