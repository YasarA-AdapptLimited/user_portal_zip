import { Address } from "./Address";
import { User } from "./User";
import { Student } from "../../shared/model/student/Student";
import { Technician } from "../../technician/model/Technician";

describe('User Model',() => {
    let testUser;

    let userData = { 
                    title: 'Mr',
                    forenames: 'XXX',
                    surname: 'YY',
                    middleName: '',
                    status: '',
                    preference: { comms: { essentialEmails: null,
                                            essentialTexts: null,
                                            importantEmails: null,
                                            importantTexts: null,
                                        },
                                ui: { showTooltips: true }
                                },
                    registrationStatus: 717750014,
                    showAccountTab: true,
                    dateOfBirth: '',
                    contact: { email: 'test@test.com',
                                awaitingEmailConfirmation: true,
                                mobilePhone: '',
                                telephone1: '',
                                telephone2: ''
                            },    
                    address: new Address({line1: '',
                                line2: '',
                                line3: '',
                                town: '',
                                county: '',
                                postcode: '',
                                country: ''
                                }),
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
                    },
                    reviewer: true,
                    student: new Student(),
                    technician: new Technician({}),
                    roles: ['prereg'],
                    hasCheckedRegistration: false,
                    training: { trainingSite: '',
                                startDate: '',
                                endDate: '',
                                address: new Address()
                            },                    
                    availableApplication: { availableForm: 1 }
                    }

    beforeEach(() => {
        testUser = new User(userData);
    });

    it('should init correctly', () => {
        expect(testUser).toBeTruthy();
    });

    it('should toString return concatenated title, forename and surname', () => {
        userData.title = 'Mr';
        testUser = new User(userData);
        expect(testUser.toString()).toBe('Mr XXX YY');
    });

    it('should toJson return an object with key name and value concatenated title, forename and surname', () => {
        userData.title = 'Mr';
        testUser = new User(userData);
        expect(testUser.toJson()).toEqual({
            name: 'Mr XXX YY'
        });
    });

    it('should user title need to be empty if not defined', () => {
        userData.title = null;
        testUser = new User(userData);
        expect(testUser.title).toBe('');
    });

    it('account tab should not be shown if user is student', () => {
        userData.roles = ['student'];
        testUser = new User(userData);
        expect(testUser.showAccountTab).toBeFalse();
    });

    it('should showNoticeOfEntry return false if isRegistrant is false', () => {
        spyOnProperty(testUser,'isRegistrant', 'get').and.returnValue(false);        
        expect(testUser.showNoticeOfEntry).toBeFalse();
    });

    it('should isPrereg return true if role is prereg', () => {  
        userData.roles = ['prereg'];
        testUser = new User(userData);    
        expect(testUser.isPrereg).toBeTrue();
    });

    it('should receipts be shown when role is any of these: registrant, prereg, student, technician', () => {   
        userData.roles = ['prereg'];
        testUser = new User(userData);      
        expect(testUser.showReceipts).toBeTrue();
    });

    it('should isSandwichStudent return true if registrationStatus is PreRegistrationTraineeS', () => {      
        expect(testUser.isSandwichStudent).toBeTrue();
    });

    it('should isJustReviewer return false if role is reviewer', () => {      
        userData.roles = ['reviewer'];
        expect(testUser.isJustReviewer).toBeFalse();
    });

    it('should perferenceNotSet should return true if preference is not set', () => {
        expect(testUser.preferencesNotSet()).toBeTrue();
    });

    it('should notice of entry should be shown if registrant joined date is greater than golive date and less than (joined date + one year)',() => {
        userData.roles = ['registrant'];
        testUser = new User(userData);      
        expect(testUser.showNoticeOfEntry).toBeTrue();
    });

    it('should technician details be defined if role is technician_applicant',() => {
        userData.roles = ['technician_applicant'];
        testUser = new User(userData);      
        expect(testUser.technician).toBeDefined();
    });

});