import { TrainingPlacement } from './TrainingPlacement';
import { TraineeReport } from './TraineeReport';

export interface Training {
  trainedAt: Array<TrainingPlacement>;
  tutoredBy: Array<{ tutorName: string }>;
  reports: Array<TraineeReport>;
  numberOfWeeks: number;
}
