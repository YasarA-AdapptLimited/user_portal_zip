import { Premise } from './Premise';

export interface TrainingSite {
  premise?: Premise;
  isOwner?: boolean;
  isRelated?: boolean;
  trainedAtId?: string;
}
