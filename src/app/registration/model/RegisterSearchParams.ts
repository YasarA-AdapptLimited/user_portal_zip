export class RegisterSearchParams {
  skip = 0;
  take = 20;
  searchBy: RegisterSearchBy = RegisterSearchBy.Number;
  firstName?: string;
  lastName?: string;
  regNumber?: string;
  applicationType?:string;
}

export enum RegisterSearchBy {
  Number = 1,
  Name = 2
}

export interface RegisterSearchResult {
  gphcId?: string;
  registrationNumber: string;
  forenames: string;
  surname: string;
  town: string;
  learningContractResponse;
  eligibleAsTutor;
}
