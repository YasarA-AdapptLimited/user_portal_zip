import { Environment } from './model/Environment';
declare function require(moduleName: string): any;

export const environment: Environment = {
  target: 'PROD',
  useMock: false,
  production: true,
  worldpayEnabled: true,
  version: require('../../package.json').version,
  webRoot: 'https://webapp-t1prd-mygphcweb-4874.azurewebsites.net',
  sso: {
    redirectUri: 'https://webapp-t1prd-mygphcweb-4874.azurewebsites.net/',
    postLogoutRedirectUri: 'https://webapp-t1prd-mygphcweb-4874.azurewebsites.net/',
    b2cScopes: ['https://gphcprdaadb2c.onmicrosoft.com/webapp-t1prd-mygphcapi-4874/user_impersonation', 'offline_access'],
    authority: 'https://login.microsoftonline.com/gphcprdaadb2c.onmicrosoft.com/B2C_1_Auth-SignUpInNew',
    clientID: '9ea710ce-d017-4191-a960-d2dca5ebbfe2',
    //pwdreset: 'https://login.microsoftonline.com/gphcprdaadb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_Auth-PasswordReset'
    pwdreset: 'https://login.microsoftonline.com/tfp/gphcprdaadb2c.onmicrosoft.com/B2C_1_Auth-PasswordResetNew'
  },
  api: {
    root: 'https://webapp-t1prd-mygphcapi-4874.azurewebsites.net'
  },
  appInsights: {
    instrumentationKey: ''
  }
};
