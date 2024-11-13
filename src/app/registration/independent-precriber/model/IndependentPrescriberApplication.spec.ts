import { ApplicationFormMode } from "../../../prereg/model/ApplicationFormMode";
import { ApplicationStatus } from "../../../prereg/model/ApplicationStatus";
import { Registrant } from "../../model/Registrant";
import { RegistrantStatus } from "../../model/RegistrantStatus";
import { IndependentPrescriberApplication } from "./IndependentPrescriberApplication";
import { IndependentPrescriberApplicationStep } from "./IndependentPrescriberApplicationStep";
import { IndependentPrescriberForm } from "./IndependentPrescriberForm";

describe('Independent Prescriber Application',() => {
    let testApplication;

    let applicationData = {
        trainee: {
            
            title: { name: 'XYZ', id: 0 },
            forenames: '',
            middleName: '',
            surname: '',
            address: {
                line1: 'XXX',
                line2: '',
                line3: '',
                town: 'YYY',
                county: 'ZZZ',
                postcode: 'X123',
                country: 'XYZ'
            },
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
        },
        form: {
            id: '',
            formStatus: ApplicationStatus.InProgress,
            isMentorRegistered: false,
            declarations: [],
            attachments: [],
            isOverallDeclarationConfirmed: false,
            step: IndependentPrescriberApplicationStep.QualificationDetails,
            minStep: IndependentPrescriberApplicationStep.Payment,
            mode: ApplicationFormMode.Editable,
            declaration: {
                isQ1Confirmed: true,
                isQ2Confirmed: false,
                isQ3Confirmed: false,
                isQ4Confirmed: false,
                isQ5Confirmed: false
            },
            registrantStatus: RegistrantStatus.Applicant
        },
        activeForm: {
            id: '',
            formStatus: ApplicationStatus.InProgress,
            isMentorRegistered: false,
            declarations: [],
            attachments: [],
            isOverallDeclarationConfirmed: false,
            step: IndependentPrescriberApplicationStep.QualificationDetails,
            minStep: IndependentPrescriberApplicationStep.Payment,
            mode: ApplicationFormMode.Editable,
            declaration: {
                isQ1Confirmed: true,
                isQ2Confirmed: false,
                isQ3Confirmed: false,
                isQ4Confirmed: false,
                isQ5Confirmed: false
            },
            registrantStatus: RegistrantStatus.Applicant
        },
        status: ApplicationStatus.NotStarted,
        forms: [],
        pastApplications: [],
        registrant: { registrationNumber: '',
                                    status: 717750002,
                                    type: 1,
                                    postalTown: '',
                                    prescriberStatuses: '',
                                    superIntendentPosition: { ownerName: '', startDate: '', endDate: '' },
                                    superintendent : '',
                                    exemptFromRevalidationSubmissions: false,
                                    title: '',
                                    forenames: '',
                                    surname: '',
                                    expiryDate: '',
                                    renewalDate: '',
                                    joinedDate: '06-27-2020'
                    }
    }

    beforeEach(() => {
        testApplication = new IndependentPrescriberApplication(applicationData, RegistrantStatus.Applicant);
    });

    it('should init correctly', () => {
        expect(testApplication).toBeTruthy();
    });
});