import { WorkExperience } from "./WorkExperience";

describe('Work Experience', () => {
    let workExperienceData = {
        id:'123',
        startDate: '06-01-2020',
        endDate:'01-01-2021',
        jobTitle: 'XX',
        premise: {
            id: '',
            registrationNumber: '',            
            name:'',
            owner:'',
            expiryDate:'',
            accreditedTo:'',
            eligibleAsTrainingSite: true,
            premiseStatus:''
        },
        supervisingPharmacists: [
            {
                id: '123',
                forenames: 'XXX',
                surname: 'YYY',
                registrationNumber: 'A123',
                eligibleAsTutor: true,
                initialRegistrationDate: '03-01-2008',
                gPhCId: 'B123',
                gphcId: '12345'
            }
        ],
        workedHoursPerWeek: 14,
        trainingWindow: {
            start: {
              from: '06-01-2020',
              to: '06-01-2021'
            },
            end: {
              to: '12-01-2021'
            }
          }
    };

    let testWorkExperience = new WorkExperience(workExperienceData);

    it('should init correctly', () => {
        expect(testWorkExperience).toBeTruthy();
    });

    it('should set id', () => {
        expect(testWorkExperience.id).toBe(workExperienceData.id);
    });

    it('should updateJobTitle update job title', () => {
        testWorkExperience.updateJobTitle('XYZ');
        expect(testWorkExperience.jobTitle).toBe('XYZ');
    });

    it('should method jobTitleValid return true', () => {
        expect(testWorkExperience.jobTitleValid).toBeTrue();
    });

    it('should method datesValid return true if dates are valid', () => {
        expect(testWorkExperience.datesValid).toBeTrue();
    });

    it('should method premiseValid return true if valid', () => {
        expect(testWorkExperience.premiseValid).toBeTrue();
    });

    it('should method supervisorValid return true if supervising pharmacists are listed', () => {
        expect(testWorkExperience.supervisorValid).toBeTrue();
    });

    it('should method workingHoursValid return true if working hours is mentioned', () => {
        expect(testWorkExperience.workingHoursValid).toBeTrue();
    });

    it('should method isValid return true if all premise, supervisor, dates, workingHours and jobTitle are valid ', () => {
        expect(testWorkExperience.isValid).toBeTrue();
    });

    it('should method allocationValid return true', () => {
        expect(testWorkExperience.allocationValid).toBeTrue();
    });

    it('should method updatePremises update existing premises', () => {
        let premise = {
            id: '123456',
            registrationNumber: '',            
            name:'ABC',
            owner:'',
            expiryDate:'',
            accreditedTo:'',
            eligibleAsTrainingSite: true,
            premiseStatus:''
        };
        testWorkExperience.updatePremises(premise);
        expect(testWorkExperience.premise).toBe(premise);
    });

    it('should method updateWorkingHours update existing workingHours', () => {
        let hrs = '15';
        testWorkExperience.updateWorkingHours(hrs);
        expect(testWorkExperience.workedHoursPerWeek).toBe(Number(hrs));
    });

    it('should method updateSupervisor update existing supervisor list', () => {
        let superviser = {
            id: '123',
            forenames: 'XXX',
            surname: 'YYY',
            registrationNumber: 'A123',
            eligibleAsTutor: true,
            initialRegistrationDate: '03-01-2008',
            gPhCId: 'B123',
            gphcId: '12345'
        };
        testWorkExperience.updateSupervisor(superviser, 0);
        expect(testWorkExperience.supervisingPharmacist).toBe(superviser);
    });

    it('should isWithinPermittedRange return true', () => {
        expect(testWorkExperience.isWithinPermittedRange).toBeFalse();
    });

    it('should method setDaterange define start and end date based on date range given', () => { 
        let dateRange = {
            from: '01-01-2020',
            to:'01-01-2021'
        }; 
        testWorkExperience.setDaterange(dateRange);      
        expect(testWorkExperience.startDate).toBe(dateRange.from);
        expect(testWorkExperience.endDate).toBe(dateRange.to);
    });
});