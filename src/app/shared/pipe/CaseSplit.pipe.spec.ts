import { CaseSplitPipe } from "./CaseSplit.pipe";

describe('CaseSplitPipe', () => {
    const pipe = new CaseSplitPipe();

    it('returns empty string if no input provided', () => {
        expect(pipe.transform(null)).toBe('');
    });

    it('transforms "test" to "Test"', () => {
        expect(pipe.transform('test')).toBe('Test');
    });
});