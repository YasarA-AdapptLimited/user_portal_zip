export class AssessmentAttemptsLetterData {

  DateOfResults: Date;
  PreEntryID: number;
  CandidateNumber: string;
  DateOfAssessment: Date;
  Outcome: string;
  Part1Outcome: string;
  Part1PassMark: number;
  Part1PassPercentage: number;
  Part1CandidateMark: number;
  Part1CandidatePercentage: number;
  Part2Outcome: string;
  Part2PassMark: number;
  Part2PassPercentage: number;
  Part2CandidateMark: number;
  Part2CandidatePercentage: number;
  Sitting: number;

}

export enum PartOutcome {
  Pass = 717750000,
  Fail = 717750001
}