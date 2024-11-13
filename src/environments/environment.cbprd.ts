import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'dev',
  dev: true,
  useMock: false,
  production: true,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'http://localhost:6420',
  maintenanceAPIURL: '',
  sso: {
    pwdreset: 'https://login.microsoftonline.com/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordResetNew',
    // pwdreset: 'https://login.microsoftonline.com/GPHCDEVAADB2C.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset',
    redirectUri: 'http://localhost:6420/assets/auth.html',
    postLogoutRedirectUri: 'http://localhost:6420/',
    b2cScopes: ['https://gphcprdaadb2c.onmicrosoft.com/webapp-t1prd-mygphcapi-4874/user_impersonation', 'offline_access'],
    authority: 'https://login.microsoftonline.com/tfp/gphcprdaadb2c.onmicrosoft.com/B2C_1_Auth-SignUpInNew',
    clientID: '9ea710ce-d017-4191-a960-d2dca5ebbfe2'
  },
  api: {
    root: 'https://webapp-t1prd-mygphcapi-4874.azurewebsites.net'
  },
  appInsights: {
    instrumentationKey: 'e313e87a-9613-4172-9457-b828a92cbac9'
  }
};
