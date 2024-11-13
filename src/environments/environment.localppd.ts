import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'DEV',
  useMock: false,
  production: true,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'http://localhost:6420',
  maintenanceAPIURL: 'https://webapp-t1ppd-maintapi-4874.azurewebsites.net',
  sso: {
    redirectUri: 'http://localhost:6420',
    postLogoutRedirectUri: 'http://localhost:6420',
    b2cScopes: ['https://GPHCDEVAADB2C.onmicrosoft.com/webapp-t1ppd-mygphcapi-7112/user_impersonation',
      'offline_access'],
    authority: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-SignUpInNew',
    clientID: 'b1b6f3e5-97a5-4ed3-9660-f6163c277d3b',
    //pwdreset: 'https://login.microsoftonline.com/gphcprdaadb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset'
    pwdreset: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordResetNew'
  },
  api: {
    root: 'https://ppdportalapi.mygphc.org'
  },
  appInsights: {
    instrumentationKey: ''
  }
};
