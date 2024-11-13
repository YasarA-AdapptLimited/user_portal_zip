import { KeysPipe } from "./Keys.pipe";

describe('KeyPipe', () => {
    const pipe = new KeysPipe();

    it('returns empty array if no arguments are provided', () => {
        const applicationStatus = 1;
        expect(pipe.transform(applicationStatus,[])).toEqual([]);
    });

    it('transforms given value', () => {
        enum applicationStatus {NotStarted = 1, PendingProcessing = 10 };
        expect(pipe.transform(applicationStatus,[])).toEqual([
            {key: '1', value: 'NotStarted', displayName: 'Not Started' },
            {key: '10', value: 'PendingProcessing', displayName: 'Pending Processing' }
        ]);
    });

});