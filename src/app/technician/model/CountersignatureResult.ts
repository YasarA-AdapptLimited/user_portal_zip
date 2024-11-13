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
}
