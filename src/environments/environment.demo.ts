import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'demo',
  useMock: false,
  production: true,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'https://wa-dev-mygphc-web.azurewebsites.net',
  sso: {
    pwdreset: 'https://login.microsoftonline.com/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordReset',
    //pwdreset: 'https://login.microsoftonline.com/GPHCDEVAADB2C.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset',
    redirectUri: 'https://wa-dev-mygphc-web.azurewebsites.net/assets/auth.html',
    postLogoutRedirectUri: 'https://wa-dev-mygphc-web.azurewebsites.net/',
    b2cScopes: ['https://GPHCDEVAADB2C.onmicrosoft.com/sp-dev-MyGPhC-Api/user_impersonation', 'offline_access'],
    authority: 'https://login.microsoftonline.com/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-SignUpIn',
    clientID: '95c8591d-f119-4d71-967e-fb327abe6d7f'
  },
  api: {
    root: 'https://mygphcapi.gphc-uk.org'
  },
  appInsights: {
    instrumentationKey: ''
  }
}
