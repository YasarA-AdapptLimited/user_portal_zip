import { Address } from '../../account/model/Address';
import { RegApplicationForm } from './RegApplicationForm';

describe('RegApplicationForm Model', () => {
    let testRegApplication;
    let testRegApplicationData = {
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
        };

    beforeEach(() => {
        testRegApplication = new RegApplicationForm(testRegApplicationData, 717750006);
    });

    it('should init correctly', () => {
        expect(testRegApplication).toBeTruthy();
    });

    it('letter of good standing is set to undefined of value is null', () => {
        testRegApplicationData.letterOfGoodStanding = {
                    hasRegistered: null,
                    regulatoryBody: null,
                    registrationNumber: null,
                    isRequested: null
        };
        testRegApplication = new RegApplicationForm(testRegApplicationData, 717750006);
        expect(testRegApplication.letterOfGoodStanding.hasRegistered).toBeUndefined();
    });

    it('if formStatus is ReadyForCountersigning define step and minStep', () => {
        testRegApplicationData.formStatus = 5;
        testRegApplication = new RegApplicationForm(testRegApplicationData, 717750006);
        expect(testRegApplication.step).toBeDefined();
    });

    it('if formStatus is inprogress define step', () => {
        testRegApplicationData.formStatus = 2;
        testRegApplication = new RegApplicationForm(testRegApplicationData, 717750006);
        expect(testRegApplication.step).toBeDefined();
    });
});