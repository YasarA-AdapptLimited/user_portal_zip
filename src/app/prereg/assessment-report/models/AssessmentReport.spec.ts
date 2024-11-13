import { RegistrantStatus } from "../../../registration/model/RegistrantStatus";
import { AssessmentReport } from "./AssessmentReport";

describe('Assessment Report Appliaction', () => {
    let testApplication;

    let applicationData = {
        trainee: {
            registrationDateLimit: '2022-11-30T00:00:00',
            qualification: {
                courseName: 'MPharm Aston',
                courseType: 717750000
            },
            title: {
                name: 'Mrs',
                id: 717750002
            },
            forenames: 'LaH4018251',
            surname: 'HuH4018251',
            middleName: 'AnH4018251',
            dateOfBirth: '1994-04-01T00:00:00',
            preEntryNumber: '4305608',
            address: {
                line1: '6 H4018251',
                line2: 'RhH4018251',
                line3: null,
                town: 'WrH4018251',
                county: 'WrH4018251',
                postcode: 'LLH4018251',
                country: 'United Kingdom',
                homeNation: null,
                latitude: null,
                longitude: null,
                countryCode: null
            },
            contact: {
                email: 'all.roles10@outlook.com',
                telephone1: '07H4018251',
                mobilePhone: null
            },
            equalityDiversity: null
        },
        training: {
            numberOfWeeks: 0,
            trainedAt: [
                {
                    trainingSite: 'Heath Lane Pharmacy',
                    startDate: '2021-07-19T00:00:00',
                    endDate: '2022-07-17T00:00:00',
                    address: {
                        line1: 'Heath Lane',
                        line2: 'Great Boughton',
                        line3: null,
                        town: 'CHESTER',
                        county: 'Cheshire',
                        postcode: 'CH3 5ST',
                        country: 'UK',
                        homeNation: null,
                        latitude: null,
                        longitude: null,
                        countryCode: null
                    }
                },
                {
                    trainingSite: 'Greenfields Pharmacy',
                    startDate: '2016-07-18T00:00:00',
                    endDate: '2016-09-13T00:00:00',
                    address: {
                        line1: '7 New Shop Parade',
                        line2: 'Greenfield Road',
                        line3: 'Greenfield',
                        town: 'HOLYWELL',
                        county: 'Clwyd',
                        postcode: 'CH8 7QS',
                        country: 'UK',
                        homeNation: null,
                        latitude: null,
                        longitude: null,
                        countryCode: null
                    }
                }
            ]
        },
        tutorDetails: [
            {
                tutorGPhCId: '0cf0',
                name: 'Mr ZZZ',
                registrationNumber: '2219058',
                startDate: '2021-07-19T00:00:00',
                endDate: '2022-07-17T00:00:00'
            },
            {
                tutorGPhCId: 'c1e',
                name: 'Mr XYZ',
                registrationNumber: '2075489',
                startDate: '2016-07-18T00:00:00',
                endDate: '2016-09-13T00:00:00'
            }
        ],
        forms: [
            {
                countersignatures: [
                    {
                        registrationNumber: '12345',
                        forenames: 'XXX',
                        surname: 'YYY',
                        town: 'ZZZ',
                        countersignerGPhCId: '0cf0',
                        id: '277',
                        decisionMadeAt: '2022-02-16',
                        decision: 2,
                        feedback: null,
                        isCertifiedPhoto: null,
                        countersignerCommentId: '864',
                        countersignerComment: {
                            traineeProgressComments: 'test',
                            anyProblemsEffected: false,
                            problemDetails: null,
                            annualLeaves: 0,
                            sickLeaves: 0,
                            otherLeaves: 0,
                            otherLeaveDetails: '',
                            commentsByTutor: '',
                            traineeFeedbackOnTutorAssessment: ''
                        },
                        isCertifiedIdentity: null
                    }
                ],
                isTrainingConfirmed: true,
                isJointTutoringArrangmentExists: null,
                confirmTempRegistration: null,
                id: '488',
                formStatus: 3,
                step: 4,
                createdAt: '2022-02-16',
                isOverallDeclarationConfirmed: false,
                scope: 3,
                declarations: [],
                attachments: []
            }
        ],
        isOpen: true,
        thirtyNineWeekReportResult: 717750000
    }

    beforeEach(() => {
        testApplication = new AssessmentReport(applicationData, RegistrantStatus.Applicant);
    });

    it('should init correctly', () => {
        expect(testApplication).toBeTruthy();
    });
});
