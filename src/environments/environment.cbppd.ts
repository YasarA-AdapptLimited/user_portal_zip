import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'dev',
  useMock: false,
  production: false,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'http://localhost:6420',
  analytics: 'UA-112004006-1',
  maintenanceAPIURL: '',
  sso: {
    pwdreset: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordResetNew',
    // pwdreset: 'https://login.microsoftonline.com/GPHCDEVAADB2C.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset',
    redirectUri: 'http://localhost:6420/assets/auth.html',
    postLogoutRedirectUri: 'http://localhost:6420/',
    b2cScopes: ['https://GPHCDEVAADB2C.onmicrosoft.com/webapp-t1ppd-mygphcapi-7112/user_impersonation', 'offline_access'],
    authority: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-SignUpInNew',
    clientID: 'b1b6f3e5-97a5-4ed3-9660-f6163c277d3b'
  },
  api: {
    root: 'https://webapp-t1ppd-mygphcapi-7112.azurewebsites.net'
  },
  appInsights: {
    instrumentationKey: '8bb3732d-cd1a-4391-8849-1ed760862700'
  }
};
