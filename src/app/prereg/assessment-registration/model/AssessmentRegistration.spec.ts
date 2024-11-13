import { Address } from "../../../account/model/Address";
import { FormScope } from "../../../registration/model/FormScope";
import { RegistrantStatus } from "../../../registration/model/RegistrantStatus";
import { ApplicationFormMode } from "../../model/ApplicationFormMode";
import { ApplicationStatus } from "../../model/ApplicationStatus";
import { TraineeReportType } from "../../model/TraineeReportType";
import { AssessmentRegistration } from "./AssessmentRegistration";
import { AssessmentRegistrationApplicationForm } from "./AssessmentRegistrationApplicationForm";
import { AssessmentRegistrationStep } from "./AssessmentRegistrationStep";


describe('Assessment Registration',() => {
    let testApplication;
    let addressDetails =  {
        line1: 'XXX',
        line2: '',
        line3: '',
        town: 'YYY',
        county: 'ZZZ',
        postcode: 'X123',
        country: 'XYZ'
    };
    let traineeDetails = {            
        title: { name: 'XYZ', id: 0 },
        forenames: '',
        middleName: '',
        surname: '',
        address: addressDetails,
        contact: {
            email: 'test@test.com',
            mobilePhone: '123456789',
            telephone1: ''
        },
        dateOfBirth: '01-01-1985',
        qualification: { courseName: 'pharmacy', courseType: 1 },
        equalityDiversity: {
            ethnicity: 0,
            ethnicityOther: '',
            nationality: 0,
            religion: 0,
            religionOther: '',
            disabled: 0,
            disabilityDetails: '',
            gender: 0,
            sexualOrientation: 0
        }
    };
    let formDetails = {
        id: '',
        formStatus: ApplicationStatus.InProgress,
        attachments: [],
        isOverallDeclarationConfirmed: false,
        step: AssessmentRegistrationStep.PersonalDetails,
        minStep: AssessmentRegistrationStep.PersonalDetails,
        mode: ApplicationFormMode.Editable,
        registrantStatus: RegistrantStatus.Applicant,
        requirePayment: true,
        scope: FormScope.AssessmentRegistration,
        trainee: traineeDetails,
        declaration: {
            isQ1Confirmed: null,
            isQ2Confirmed: null,
            isQ3Confirmed: null,
            isQ4Confirmed: null
        },
        training: {
            trainedAt: [
                {
                    trainingSite: 'xyz',
                    startDate: '01-06-2021',
                    endDate: '01-12-2021',
                    address: addressDetails
                }
            ],
            tutoredBy: [{ tutorName: 'abc' }],
            reports: [{
                type: TraineeReportType.ThirteenWeekReport,
                result: 'result'
            }],
            numberOfWeeks: 26
        },
        tutorDetails: [{
            tutorGPhCId: '123',
            registrationNumber: '123456',
            name: 'pqr',
            startDate: '01-06-2021',
            endDate: '01-12-2021',
        }],
        assessmentAttempts: [{
            sitting: 2,
            outcome: 'pass',
            session: 'session',
            applicationStatus: 456,
            assessmentName: 'asd',
            assessmentSessionName: 'string'
        }],
        isTrainingConfirmed: true,
        isAssessmentConfirmed: true
    };

    let applicationData: AssessmentRegistration = {
        trainee: traineeDetails,      
        activeAssessment: 'yes',
        forms: [new AssessmentRegistrationApplicationForm(formDetails, RegistrantStatus.Applicant)],
        status: ApplicationStatus.NotStarted,
        activeForm: new AssessmentRegistrationApplicationForm(formDetails, RegistrantStatus.Applicant) ,        
        pastApplications: [],
        training:{
            trainedAt: [
                {
                    trainingSite: 'xyz',
                    startDate: '01-06-2021',
                    endDate: '01-12-2021',
                    address: new Address(addressDetails)
                }
            ],
            tutoredBy: [{ tutorName: 'abc' }],
            reports: [{
                type: TraineeReportType.ThirteenWeekReport,
                result: 'result'
            }],
            numberOfWeeks: 26
        },
        tutorDetails: [{
            tutorGPhCId: '123',
            registrationNumber: '123456',
            name: 'pqr',
            startDate: '01-06-2021',
            endDate: '01-12-2021',
        }],
        assessmentAttempts: [{
            sitting: 2,
            outcome: 'pass',
            session: 'session'
        }],
        declaration: {
            isQ1Confirmed: null,
            isQ2Confirmed: null,
            isQ3Confirmed: null,
            isQ4Confirmed: null,
          },
        registrationFees: {
            applicationFee: 50,
            registrationFee: 50
        },
        form: {},
        assessmentRegistrationDeadlineDate: '01-06-2022',
        registrationApplicationScheme: {
            isOpened: true,
            openingDate: '01-01-2022'
        },
        isOpen: {}
    }

    beforeEach(() => {
        testApplication = new AssessmentRegistration(applicationData, RegistrantStatus.Applicant);
    });

    it('should init correctly, condition: scope is not TechnicianApplicant', () => {
        applicationData.forms[0].scope = FormScope.AssessmentRegistration;
        expect(testApplication).toBeTruthy();
    });

    it('should init correctly, condition: scope is TechnicianApplicant', () => {
        applicationData.forms[0].scope = FormScope.TechnicianApplicant;
        expect(testApplication).toBeTruthy();
    });
});