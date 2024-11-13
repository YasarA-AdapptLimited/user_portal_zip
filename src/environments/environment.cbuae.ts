import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'dev',
  useMock: false,
  production: false,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'http://localhost:6420',
  maintenanceAPIURL: '',
  sso: {
    //pwdreset: 'https://login.microsoftonline.com/GPHCDEVAADB2C.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset',
    pwdreset: 'https://login.microsoftonline.com/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordResetNew',
    redirectUri: 'http://localhost:6420/assets/auth.html',
    postLogoutRedirectUri: 'http://localhost:6420/',
    b2cScopes: ['https://GPHCDEVAADB2C.onmicrosoft.com/webapp-t1uae-mygphcapi-b4aa/user_impersonation', 'offline_access'],
    authority: 'https://login.microsoftonline.com/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-SignUpInNew',
    clientID: 'e729da50-5189-472c-90fe-1635513b80ea'
  },
  api: {
    root: 'https://webapp-t1uae-mygphcapi-b4aa.azurewebsites.net'
  },
  appInsights: {
    instrumentationKey: '268ad020-d039-418f-bad6-f761663480c0'
  }
};
