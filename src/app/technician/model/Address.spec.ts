import { Address } from './Address';

describe('Address Model', () => {
    let testAddress;
    let addressData =  { line1: 'xxx',
                            line2: '',
                            line3: '',
                            town: 'yyy',
                            county: 'zzz',
                            postcode: '123',
                            country: 'xyz'
                        }

    beforeEach(() => {
        testAddress = new Address(addressData);
    });

    it('should init correctly', () => {
        expect(testAddress).toBeTruthy();
    });

    it('should stringify given address',() => {
        expect(testAddress.toString()).toBe('xxx, yyy, zzz, xyz, 123');
    });
});