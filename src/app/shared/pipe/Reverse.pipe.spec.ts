import { ReversePipe } from "./Reverse.pipe";

describe('ReversePipe', () => {
    const pipe = new ReversePipe();

    it('returns reversed value', () => {
        expect(pipe.transform(['a','b','c'])).toEqual(['c','b','a']);
    });
});