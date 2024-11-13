import { StepValidity } from './StepValidity';

export interface FormStepSummary {
  stepId: number;
  title: string;
  current: boolean;
  validity: StepValidity;
  disabled: boolean;
  waiting: boolean;
}
