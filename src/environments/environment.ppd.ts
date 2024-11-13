import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'PPD',
  useMock: false,
  production: true,
  hideLogin: true,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'https://ppdportalweb.mygphc.org',
  maintenanceAPIURL: 'https://webapp-t1ppd-maintapi-4874.azurewebsites.net',
  sso: {
    redirectUri: 'https://ppdportalweb.mygphc.org',
    postLogoutRedirectUri: 'https://ppdportalweb.mygphc.org',
    b2cScopes: ['https://GPHCDEVAADB2C.onmicrosoft.com/webapp-t1ppd-mygphcapi-7112/user_impersonation',
      'offline_access'],
    authority: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-SignUpInNew',
    clientID: 'b1b6f3e5-97a5-4ed3-9660-f6163c277d3b',
    //pwdreset: 'https://login.microsoftonline.com/GPHCDEVAADB2C.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset'
    pwdreset: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordResetNew'
  },
  api: {
    root: 'https://ppdportalapi.mygphc.org'
  },
  appInsights: {
    instrumentationKey: '8bb3732d-cd1a-4391-8849-1ed760862700'
  }
};
