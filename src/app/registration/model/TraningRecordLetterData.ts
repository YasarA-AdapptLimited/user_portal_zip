export interface TrainingRecordLetterData {
    Date: string
    Email: string
    Firstname: string
    JobTitle: string
    Lastname: string
    Middlename: string
    PreEntryNumber: string
    TrainingSites: TrainingSite[] 
}

export interface TrainingSite {
    AddressLine1: string
    AddressLine2: string
    AddressLine3: string
    County: string
    EndDate: string
    PharmacyName: string
    PlacementId: string
    PostCode: string
    PremiseId: string
    StartDate: string
    Town: string
    TrainedAtId: string
  }