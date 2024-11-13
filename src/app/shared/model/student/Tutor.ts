import { RegisterSearchResult } from '../../../registration/model/RegisterSearchParams';
import { LearningContractResponse } from './LearningContractResponse';

export interface Tutor extends RegisterSearchResult {
  tutoredById?;
  learningContractResponse: LearningContractResponse;
  learningContractResponseFeedback: string;
  learningContractResponseMadeAt: string;
  eligibleAsTutor;
}
