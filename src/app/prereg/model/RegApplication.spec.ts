import { RegApplication } from "./RegApplication";
import { Address } from '../../account/model/Address';

describe('RegApplication Model', () => {
    let testRegApplication;
    let testRegApplicationData = {
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
        training: {
            trainedAt: [{
                trainingSite: 'ABC',
                startDate: '01-01-2000',
                endDate: '',
                address: new Address({
                    line1: 'line 1',
                    line2: '',
                    line3: '',
                    town: 'town x',
                    county: 'county',
                    postcode: 'a123',
                    country: 'ABC'
                })
            }],
            tutoredBy: [],
            reports: [],
            numberOfWeeks: 52
        },
        forms: [{
                id: '123',
                formStatus: 3,
                declarations: [{ dynamicFormId: '345', answers: [] }],
                attachments: [],
                isOverallDeclarationConfirmed: true,
                isTrainingConfirmed: true,
                isAssessmentConfirmed: true,
                letterOfGoodStanding: {
                    hasRegistered: true,
                    regulatoryBody: 'test',
                    registrationNumber: 123,
                    isRequested: false
                },
                step: 12,
                minStep: 13,
                mode: 0,
                registrantStatus: 717750006,
                requirePayment: true,
                scope: 4,
                countersignatures: []
        }]
    };

    beforeEach(() => {
        testRegApplication = new RegApplication(testRegApplicationData, 717750006);
    });

    it('should init correctly', () => {
        expect(testRegApplication).toBeTruthy();
    });

    it('when form scope is technician applicant', () => {
        testRegApplicationData.forms[0].scope = 2;        
        testRegApplication = new RegApplication(testRegApplicationData, 717750006);
    });

});