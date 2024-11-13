import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'dev',
  useMock: false,
  production: false,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'http://localhost:6420',
  maintenanceAPIURL: 'https://webapp-t1dev-maintapi-4874.azurewebsites.net',
  sso: {
    //pwdreset: 'https://login.microsoftonline.com/GPHCDEVAADB2C.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset',
    pwdreset: 'https://login.microsoftonline.com/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordReset',
    redirectUri: 'http://localhost:6420',
    postLogoutRedirectUri: 'http://localhost:6420/',
    b2cScopes: ['https://GPHCDEVAADB2C.onmicrosoft.com/webapp-t1dev-mygphcapi-6eb6/user_impersonation', 'offline_access'],
    authority: 'https://login.microsoftonline.com/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-SignUpIn',
    clientID: 'b9c1d5db-e2fc-49ee-a1a4-588a7be1c3c6'
  },
  api: {
    root: 'https://webapp-t1dev-mygphcapi-6eb6.azurewebsites.net',
    admin: 'https://webapp-t1dev-mygphcadminapi-6eb6.azurewebsites.net'
  },
  appInsights: {
    instrumentationKey: '00592078-21ef-4c64-a8a7-86d095f0fdfd'
  }
};
