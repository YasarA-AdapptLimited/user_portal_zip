import { CountersignatureOutcome } from './CountersignatureOutcome';

export interface CountersignatureResult {
  forenames: string;
  registrationNumber: string;
  surname: string;
  town: string;
  decisionMadeAt: string;
  decision: CountersignatureOutcome;
  feedback: string;
  learningContractResponse;
  eligibleAsTutor;
  countersignerCommentId?: string;
  countersignerComment?: CountersignerComment;
}

export interface CountersignerComment {
  traineeProgressComments: string;
  anyProblemsEffected: boolean;
  problemDetails: string;
  annualLeaves: number;
  sickLeaves: number;
  otherLeaves: number;
  otherLeaveDetails: string;
  commentsByTutor: string;
  traineeFeedbackOnTutorAssessment: any;
}
