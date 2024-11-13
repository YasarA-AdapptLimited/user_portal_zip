import { SsoConfig } from './SsoConfig';
import { WebApiConfig } from './WebApiConfig';
import { AppInsightsConfig } from './AppInsights';

export interface Environment {
  target: string;
  production: boolean;
  version: string;
  api: WebApiConfig;
  sso: SsoConfig;
  useMock: boolean;
  webRoot: string;
  dev?: boolean;
  worldpayEnabled: boolean;
  analytics?: string;
  hideLogin?: boolean;
  appInsights: AppInsightsConfig;
  maintenanceAPIURL?: string;
}
