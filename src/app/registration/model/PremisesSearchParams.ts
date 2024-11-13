export class PremisesSearchParams {
  skip = 0;
  take = 20;
  searchBy: PremisesSearchBy = PremisesSearchBy.Number;
  postcode?: string;
  regNumber?: string;
  unregisteredPremiseName?: string;
  unregisteredPremisePostCode: string;
}

export enum PremisesSearchBy {
  Number = 1,
  Postcode = 2,
  NotOnRegister = 3,
  
}

export interface PremisesSearchResult {
  registrationNumber: string;
  forenames: string;
  surname: string;
  town: string;
}
