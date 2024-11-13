import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'DEV',
  useMock: false,
  production: true,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'http://localhost:6420',
  sso: {
    //pwdreset: 'https://login.microsoftonline.com/GPHCDEVAADB2C.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset',
    pwdreset: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordResetNew',
    redirectUri: 'http://localhost:6420',
    postLogoutRedirectUri: 'http://localhost:6420',
    b2cScopes: ['https://GPHCDEVAADB2C.onmicrosoft.com/webapp-t1sit-mygphcapi-d78f/user_impersonation',
      'offline_access'],
    authority: 'https://login-dev.mygphc.org/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-SignUpInNew',
    clientID: '3a151465-32ad-41a1-b6ff-f7a6cdaed925'
  },
  api: {
    root: 'https://webapp-t1sit-mygphcapi-d78f.azurewebsites.net'
  },
  appInsights: {
    instrumentationKey: ''
  }
};
