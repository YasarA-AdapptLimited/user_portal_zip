import { TechnicianApplication } from "./TechnicianApplication";

describe('Technician Application', () => {
    let applicationData = {
                        trainee: {},                        
                        forms: [{formStatus: 1, workExperiences: []}, {formStatus: 2, workExperiences: []}],
                        status: 1,
                        activeForm: {},
                        pastApplications: [],
                        isFirstYearPaymentAvailable: true
    };
    let testApplication = new TechnicianApplication(applicationData, 717750003);

    it('should init correctly', () => {
        expect(testApplication).toBeTruthy();
    });
});