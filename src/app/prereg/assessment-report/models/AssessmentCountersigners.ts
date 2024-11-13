import { CountersignatureOutcome } from '../../model/CountersignatureOutcome';


export interface AssessmentCountersigner {
    forenames: string;
    registrationNumber: string;
    surname: string;
    town: string;
    decisionMadeAt: string;
    decision: CountersignatureOutcome;
    feedback: string;
    learningContractResponse;
    eligibleAsTutor;
    countersignerId;
    id;
    countersignerComment?: CountersignerComment;
    countersignerCommentId;
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
    traineeFeedbackOnTutorAssessment: string;
}