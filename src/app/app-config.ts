import { Configuration, Logger } from 'msal';
import { MsalAngularConfiguration, MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';


// this checks if the app is running on IE
export const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

/** =================== REGIONS ====================
 * 1) B2C policies and user flows
 * 2) Web API configuration parameters
 * 3) Authentication configuration parameters
 * 4) MSAL-Angular specific configuration parameters
 * ================================================= 
*/

// #region 1) B2C policies and user flows
/**
 * Enter here the user flows and custom policies for your B2C application,
 * To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_Auth-SignUpInNew",
        resetPassword: "B2C_1_Auth-PasswordResetNew",
        //editProfile: "b2c_1_edit_profile"
    },
    authorities: {
        signUpSignIn: {
            //authority: "https://login.microsoftonline.com/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-SignUpIn"
            authority: environment.sso.authority
        },
        resetPassword: {
            //authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_reset"
            //authority: "https://login.microsoftonline.com/tfp/GPHCDEVAADB2C.onmicrosoft.com/B2C_1_Auth-PasswordReset"
            authority: environment.sso.pwdreset
        },
        // editProfile: {
        //     authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_edit_profile"
        // }
    }
}
// #endregion


// #region 2) Web API Configuration
/** 
 * Enter here the coordinates of your Web API and scopes for access token request
 * The current application coordinates were pre-registered in a B2C tenant.
 */
export const apiConfig: { b2cScopes: string[], webApi: string } = {
    b2cScopes: environment.sso.b2cScopes,
    //webApi: environment.webRoot
    webApi: environment.api.root
};
// #endregion



// #region 3) Authentication Configuration
/** 
 * Config object to be passed to Msal on creation. For a full list of msal.js configuration parameters,
 * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_configuration_.html
 */
//declare var Msal;
export const msalConfig: Configuration = {
    auth: {
        clientId: environment.sso.clientID,
        authority: environment.sso.authority,
        redirectUri: environment.sso.redirectUri,
        postLogoutRedirectUri: environment.sso.postLogoutRedirectUri,
        navigateToLoginRequestUrl: true,
        validateAuthority: false,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: isIE, // Set this to "true" to save cache in cookies to address trusted zones limitations in IE
    },
    system: {
        loadFrameTimeout: 60000, //6 sec
    }
}

//  logger: new Logger(this.loggerCallback.bind(this), { level: Msal.LogLevel.Verbose, piiLoggingEnabled: true }),

/** 
 * Scopes you enter here will be consented once you authenticate. For a full list of available authentication parameters, 
 * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
 */
export const loginRequest: { scopes: string[] } = {
    scopes: ['openid', 'profile']
    //, state: '${b2cPolicies.authorities.resetPassword.authority}&client_id=${msalConfig.auth.clientId}&nonce=defaultNonce&redirect_uri=${msalConfig.auth.redirectUri}&scope=openid&response_type=id_token&prompt=login'
};
// Scopes you enter will be used for the access token request for your web API
export const tokenRequest = {

    scopes: apiConfig.b2cScopes,
    //https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/97
    authority: null,
    account: null
    //   account: this.userId // i.e. [https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read]
};
// #endregion



// #region 4) MSAL-Angular Configuration
// here you can define the coordinates and required permissions for your protected resources
export const protectedResourceMap: [string, string[]][] = [
    [apiConfig.webApi, apiConfig.b2cScopes] // i.e. [https://fabrikamb2chello.azurewebsites.net/hello, ['https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read']]
];

/** 
 * MSAL-Angular specific authentication parameters. For a full list of available options,
 * visit https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular#config-options-for-msal-initialization
*/
export const msalAngularConfig: MsalAngularConfiguration = {
    popUp: !isIE,
    consentScopes: [
        ...loginRequest.scopes,
        ...tokenRequest.scopes,
    ],
    unprotectedResources: [], // API calls to these coordinates will NOT activate MSALGuard
    protectedResourceMap,     // API calls to these coordinates will activate MSALGuard
    extraQueryParameters: {}
}
// #endregion