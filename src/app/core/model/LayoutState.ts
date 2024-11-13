import { BannerState } from './BannerState';

export interface LayoutState {
  bannerState: BannerState;
  fullscreen: boolean;
  showBranding: boolean;
  navbarOpen: boolean;
  overlay: boolean;
  accountMode: boolean;
  width: number;
  height: number;
  xs: boolean;
  md: boolean;
  lg: boolean;
  fullscreenSpinner: { visible: boolean; text: string };
}
