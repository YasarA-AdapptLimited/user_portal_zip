import { UtcDatePipe } from "./UtcDate.pipe";

describe('TimePipe', () => {
    const pipe = new UtcDatePipe();

    it('returns transformed date value', () => {
        const value: Date = new Date('05-18-2021');
        expect(pipe.transform(value)).toBe('18/05/2021');
    });
});