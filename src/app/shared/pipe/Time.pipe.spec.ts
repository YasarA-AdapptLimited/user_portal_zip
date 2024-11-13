import { TimePipe } from "./Time.pipe";


describe('TimePipe', () => {
    const pipe = new TimePipe();

    it('returns transformed date value', () => {
        const value: Date = new Date('05-18-2021');
        expect(pipe.transform(value, [])).toBe('00:00:00:000');
    });
});