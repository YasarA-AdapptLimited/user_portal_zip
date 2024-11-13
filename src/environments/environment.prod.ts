import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'PROD',
  useMock: false,
  production: true,
  worldpayEnabled: true,
  hideLogin: false,
  version: require('../../package.json').version,
  webRoot: 'https://www.mygphc.org',
  analytics: 'UA-116303383-1',
  maintenanceAPIURL: 'https://webapp-t1prd-maintapi-4874.azurewebsites.net',
  sso: {
    redirectUri: 'https://www.mygphc.org/',
    postLogoutRedirectUri: 'https://www.mygphc.org/',
    b2cScopes: ['https://gphcprdaadb2c.onmicrosoft.com/webapp-t1prd-mygphcapi-4874/user_impersonation', 'offline_access'],
    authority: 'https://login.mygphc.org/tfp/gphcprdaadb2c.onmicrosoft.com/B2C_1_Auth-SignUpInNew',
    clientID: '9ea710ce-d017-4191-a960-d2dca5ebbfe2',
    //pwdreset: 'https://login.microsoftonline.com/gphcprdaadb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset'
    pwdreset: 'https://login.mygphc.org/tfp/gphcprdaadb2c.onmicrosoft.com/B2C_1_Auth-PasswordResetNew'
  },
  api: {
    root: 'https://portalapi.mygphc.org'
  },
  appInsights: {
    instrumentationKey: 'e313e87a-9613-4172-9457-b828a92cbac9'
  }
};
