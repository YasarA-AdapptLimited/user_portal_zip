export class InitialRegistrantQualificationDetail {
  registrationRoute: number;
  eeaPharmacistQualificationDetail: eeaPharmacistQualificationDetail;
  ukPharmacistQualificationDetail: ukPharmacistQualificationDetail;
  ospapPharmacistQualificationDetail:ospapPharmacistQualificationDetail;
  irelandPharmacistQualificationDetail: irelandPharmacistQualificationDetail;
  pharmacyTechnicianQualificationDetail: pharmacyTechnicianQualificationDetail;
  trainingDetails: trainingDetails[]
}

export interface pharmacyTechnicianQualificationDetail{
  degreeName1: string;
  qualifiedDate1: string;
  degreeName2: string;
  qualifiedDate2: string
}

export interface irelandPharmacistQualificationDetail{
  courseId: string;
  courseName: string;
  yearObtained: number
}

export interface ospapPharmacistQualificationDetail{
  ospapCountryQualified: string;
  ospapCourseId: string;
  ospapCourseName: string;
  degreeName: string;
  universityName: string;
  yearObtained: number;
  ospapDateQualified: string;
  assessmentYear: string
}

export interface ukPharmacistQualificationDetail {
  courseId: string;
  courseName: string;
  yearQualified: number;
  assessmentYear: string
}

export interface eeaPharmacistQualificationDetail {
  countryQualified: string;
  eeaDirectiveRoute?: string;
  courseName?: string;
  dateStarted?: Date;
  datePassed?: Date,
  educationTrainingDetails?: string;
  countryFirstRecognized: string;
  cvUpload?: any;
  nameOfUniversity?: string;
}

export interface PreRegTraining {
  trainingSiteName: string;
  trainingSiteAddress: string;
  startedDate: Date;
  endedDate: Date;
}

export interface trainingDetails 
  {
    trainingSiteName: string;
    trainingSiteAddress: string;
    trainingStartDate: Date;
    trainingEndDate: Date;
  }

  export class trainingSites
    {
      trainingSite: string;
      line1: string;
      line2: string;
      line3: string;
      town: string;
      county: string;
      country: string;
      postcode: string;
      startDate: string;
      endDate: string;
    }

    export enum LegacyRegistrationRoute{
            Adjudicating = 717750000,
            NonEEATechnicianApplicant = 717750001,
            Reciprocity = 717750002,
            RouteATechnicianApplicant = 717750003,
            RouteBTechnicianApplicant = 717750004
    }

export enum eeaDirectiveRoute{
        Article44 = 717750000,
        Article23 = 717750001,
       //[Description("Non-Auto (EEA Qual)")]
        NonAutoEEAQual = 717750002,
      //[Description("Non-Auto (Non-EEA Qual)")]
        NonAutoNonEEAQual = 717750003,
}

export const EEACountries = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Republic of Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Ireland',
  'Italy',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Poland',
  'Portugal',
  'Romania',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Iceland',
  'Liechtenstein',
  'Norway',
  'Switzerland'
];


export const EEADirectiveRoute = ['Article44', 'Article23', 'NonAutoEEAQual', 'NonAutoNonEEAQual'];
