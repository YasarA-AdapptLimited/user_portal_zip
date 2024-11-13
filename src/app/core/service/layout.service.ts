import { Injectable, EventEmitter } from '@angular/core';
import { LayoutState } from '../model/LayoutState';
import { BannerState } from '../model/BannerState';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LayoutService {

  initialState: LayoutState = {
    bannerState: BannerState.default,
    fullscreen: false,
    showBranding: true,
    navbarOpen: false,
    accountMode: true,
    width: 0,
    height: 0,
    xs: false,
    md: false,
    lg: false,
    overlay: false,
    fullscreenSpinner: { visible: false, text: 'Saving' }
  };

  public state$ = new BehaviorSubject<LayoutState>(this.initialState);

  public get state() {
    return this.state$.value;
  }

  public setBannerState(bannerState: BannerState) {
    // if (hasBanner === this.state.hasBanner ) { return; }
    setTimeout(() => {
      const newState = Object.assign(this.state$.value, { bannerState });
      this.state$.next(newState);
    });
  }

  public setOverlay(overlay: boolean) {
    setTimeout(() => {
      const newState = Object.assign(this.state$.value, { overlay });
      this.state$.next(newState);
    });
  }
/*
  private overlayFadeout() {
    setTimeout(() => {
      const newState = Object.assign(this.state$.value, { overlayFadeout: true });
      this.state$.next(newState);

      setTimeout(() => {
        const nextState = Object.assign(this.state$.value, { overlayFadeout: false });
        this.state$.next(nextState);
      }, 400);

    });
  }
*/



  public setAccountMode(accountMode: boolean) {
    setTimeout(() => {
      const newState = Object.assign(this.state$.value, { accountMode });
      this.state$.next(newState);
    });
  }




  public setNavbarOpen(navbarOpen: boolean) {
    // if (hasBanner === this.state.hasBanner ) { return; }
    setTimeout(() => {
      const newState = Object.assign(this.state$.value, { navbarOpen });
      this.state$.next(newState);
    });
  }

  public toggleNavbar() {
    this.setNavbarOpen(!this.state$.value.navbarOpen);
  }

  public setBranding(showBranding: boolean) {
   // if (showBranding === this.state.showBranding ) { return; }
    setTimeout(() => {
      const newState = Object.assign(this.state$.value, { showBranding });
      this.state$.next(newState);
    });
  }

  public toggleFullscreen() {
    setTimeout(() => {
      const newState = Object.assign(this.state$.value, { fullscreen: !this.state$.value.fullscreen });
      this.state$.next(newState);
    });
  }

  public setFullscreen(fullscreen) {
 //   if (fullscreen === this.state.fullscreen ) { return; }
    setTimeout(() => {
      const newState = Object.assign(this.state$.value, { fullscreen });
      this.state$.next(newState);
    });
  }

  public setFullscreenSpinner(visible: boolean, text = 'Saving') {
    setTimeout(() => {
      const newState = Object.assign(this.state$.value, {
        fullscreenSpinner: { visible, text },
         overlay: visible
      });
      this.state$.next(newState);
    });
  }

  public setSize(width: number, height: number) {
    let xs, md, lg;
    if (width < 767) {
      xs = true;
      md = false;
      lg = false;
    }
    if (width > 767) {
      xs = false;
      md = true;
      lg = true;
    }

    if (width > 1024) {
      lg = true;
      md = false;
      xs = false;
    }
     setTimeout(() => {
      const newState = Object.assign(this.state$.value, { width, height, xs, md, lg });
      this.state$.next(newState);
    });
  }


  public reset(fullscreen = false) {

    setTimeout(() => {
      const newState = Object.assign(this.state$.value, {
        bannerState: BannerState.default,
        fullscreen,
        fullscreenSpinner: { visible: false, text: 'Saving' },
        branding: true,
        navbarOpen: false,
        overlay: false,
        accountMode: false
      });
      this.state$.next(newState);
    });
/*
    this.setBannerState(BannerState.default);
    this.setFullscreen(false);
    this.setBranding(true);
    this.setNavbarOpen(false);
    this.setOverlay(false);
    this.setAccountMode(false);
    // TODO: window should be abstracted
    */
    window.scrollTo(0, 0);
  }
}
