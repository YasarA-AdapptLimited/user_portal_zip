import { CommsPreference } from './CommsPreference';

export interface UserPreference {
  comms: CommsPreference;
  ui: {
    showTooltips: boolean;
  };
}
