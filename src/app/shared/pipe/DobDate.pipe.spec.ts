import { DobDatePipe } from "./DobDate.pipe";


describe('DobDatePipe', () => {
    const pipe = new DobDatePipe();

    it('returns null if null is provided', () => {
        expect(pipe.transform(null)).toBe(null);
    });

    it('returns transformed date value', () => {
        expect(pipe.transform('01-01-1990')).toBe('01-01-1990');
    });
});