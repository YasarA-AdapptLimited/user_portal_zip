export enum LoggedInState {
  loggedOut,
  checking,
  loginRedirect,
  gotIdToken,
  attemptAcquireTokenSilently,
  acquireTokenPopup,
  acquireTokenFail,
  tokenAcquired,
  loadingUser,
  loggedIn,
  forgotPassword,
  error
}
