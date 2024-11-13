import { TechnicianApplicationForm } from "./TechnicianApplicationForm";
import { WorkExperience } from "./WorkExperience";


describe('Technician Application', () => {
    let applicationFormData = {
        id: '',
        formStatus: 1,
        declarations: [],
        attachments: [],
        isOverallDeclarationConfirmed: false,
        applicationType: 981360000,
        educationDetails: {},
        workExperiences: [],
        previousApplicationsAndRegistrations: {
            applications: {
                registration: {
                    registrationNumber: 'XYZ',
                },
                preRegistrationTraining: {
                    preRegistrationNumber: 'XXX'
                },
            },
            ukRegistration: {
                registered: false
            }
        },
        isSupportingDocumentsForwardedConfirmed: false,
        step: 14,
        minStep: 14,
        mode: 0,
        registrantStatus: 717750000,
        requirePayment: true
    };
    let testApplicationForm = new TechnicianApplicationForm(applicationFormData, 717750003);

    it('should init correctly', () => {
        expect(testApplicationForm).toBeTruthy();
    });

    it('should readOnly return false', () => {
        expect(testApplicationForm.readonly).toBeFalsy();
    });

    it('should method clearWorkExperience clear the workexperiences', () => {
        testApplicationForm.clearWorkExperience();
        expect(testApplicationForm.workExperiences).toHaveSize(0);
    });

    it('should method clearAttachments clear the attachments', () => {
        testApplicationForm.clearAttachments();
        expect(testApplicationForm.attachments).toHaveSize(0);
    });

    it('should method clearPreviousApplicationAndRegistrations set properties of previousApplicationsAndRegistrations to null', () => {
        testApplicationForm.clearPreviousApplicationAndRegistrations();
        expect(testApplicationForm.isSupportingDocumentsForwardedConfirmed).toBeNull();
    });

    it('should method clearPreviousApplicationAndRegistrations set properties of preRegistrationTraining applications to null', () => {
        testApplicationForm.clearPreviousApplicationAndRegistrations();
        expect(testApplicationForm.previousApplicationsAndRegistrations.applications.preRegistrationTraining.preRegistrationNumber).toBeNull();
    });

    it('should method clearPreviousApplicationAndRegistrations set properties of registtration applications to null', () => {
        testApplicationForm.clearPreviousApplicationAndRegistrations();
        expect(testApplicationForm.previousApplicationsAndRegistrations.applications.registration.registrationNumber).toBeNull();
    });

    it('should method clearStepsDependentOnApplicationType call methods: clearWorkExperience, clearAttachments, clearPreviousApplicationAndRegistrations', () => {
        spyOn(testApplicationForm, 'clearWorkExperience');
        spyOn(testApplicationForm, 'clearAttachments');
        spyOn(testApplicationForm, 'clearPreviousApplicationAndRegistrations');
        testApplicationForm.clearStepsDependentOnApplicationType();
        expect(testApplicationForm.clearWorkExperience).toHaveBeenCalled();
        expect(testApplicationForm.clearAttachments).toHaveBeenCalled();
        expect(testApplicationForm.clearPreviousApplicationAndRegistrations).toHaveBeenCalled();
    });

    it('should method getTrainingWeeks return training weeks based on workexperiences', () => {  
        let workExp = {
            startDate: '01-01-2019',
            endDate: '01-01-2021',
            id: '',
            supervisingPharmacists: [],
            supervisingPharmacist: {},
            placementId: '',
            workedHoursPerWeek: 7,
            jobTitle: ''
        };
        testApplicationForm.workExperiences = [new WorkExperience(workExp)];
        expect(testApplicationForm.getTrainingWeeks()).toBe(104);
    });

    it('should method getHoursWorked return number of hours worked based on workexperiences provided', () => {        
        let workExp = {
            startDate: '01-01-2019',
            endDate: '01-01-2021',
            id: '',
            supervisingPharmacists: [],
            supervisingPharmacist: {},
            placementId: '',
            workedHoursPerWeek: 7,
            jobTitle: ''
        };
        testApplicationForm.workExperiences = [new WorkExperience(workExp)];
        testApplicationForm.getTrainingWeeks();
        expect(testApplicationForm.getHoursWorked()).toBe(728);
    });
});