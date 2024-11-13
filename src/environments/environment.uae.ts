import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'UAE',
  useMock: false,
  production: true,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'https://uatportalweb.mygphc.org',
  maintenanceAPIURL: 'https://webapp-t1dev-maintapi-4874.azurewebsites.net',
  sso: {
    redirectUri: 'https://uatportalweb.mygphc.org/',
    postLogoutRedirectUri: 'https://uatportalweb.mygphc.org/',
    b2cScopes: ['https://GPHCDEVAADB2C.onmicrosoft.com/webapp-t1uae-mygphcapi-b4aa/user_impersonation', 'offline_access'],
    authority: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-SignUpInNew',
    clientID: 'e729da50-5189-472c-90fe-1635513b80ea',
    //pwdreset: 'https://login.microsoftonline.com/GPHCDEVAADB2C.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset'
    pwdreset: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordResetNew'
  },
  api: {
    root: 'https://webapp-t1uae-mygphcapi-b4aa.azurewebsites.net',
    admin: 'https://webapp-t1uae-mygphcadminapi-b4aa.azurewebsites.net',
  },
  appInsights: {
    instrumentationKey: '268ad020-d039-418f-bad6-f761663480c0'
  }
};
