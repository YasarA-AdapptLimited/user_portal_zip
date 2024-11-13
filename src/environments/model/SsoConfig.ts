export interface SsoConfig {
  clientID: string;
  authority: string;
  b2cScopes: Array<string>;
  redirectUri: string;
  postLogoutRedirectUri: string;
  pwdreset: string;
}
