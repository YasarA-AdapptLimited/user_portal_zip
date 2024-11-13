import { Technician } from "./Technician";

describe('Technician Model', () => {
    let technicianData = { registrationNumber: '',
                            status: 717750002,
                            type: 1,
                            postalTown: '',
                            prescriberStatuses: '',
                            superIntendentPosition: { ownerName: 'Mr.XYZ', startDate: '', endDate: '' },
                            superintendent : '',
                            exemptFromRevalidationSubmissions: true,
                            title: 'Mr',
                            forenames: 'XX',
                            surname: 'YY',
                            expiryDate: '',
                            renewalDate: '',
                            joinedDate: ''
                        };
    let testTechinican = new Technician(technicianData);

    it('should init correctly', () => {
        expect(testTechinican).toBeTruthy();
    });

    it('should stringify technician name on call of toString method', () => {
        expect(testTechinican.toString()).toBe('Mr XX YY');
    });

    it('should superIndent be defined if superIndent owner name is defined',() => {
        expect(testTechinican.superintendent).toBe('Mr.XYZ');
    });
});