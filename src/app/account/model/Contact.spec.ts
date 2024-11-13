import { Contact } from "./Contact";

describe('Contact Model', () => {
    let testContact;
    let contactData =  { email: 'test@test.com',
                         awaitingEmailConfirmation: true,
                         mobilePhone: '',
                         telephone1: '',
                         telephone2: ''
                        }

    beforeEach(() => {
        testContact = new Contact(contactData);
    });

    it('should init correctly', () => {
        expect(testContact).toBeTruthy();
    });
});