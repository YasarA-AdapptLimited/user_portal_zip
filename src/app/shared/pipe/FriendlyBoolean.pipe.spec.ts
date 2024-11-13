import { FriendlyBooleanPipe } from "./FriendlyBoolean.pipe";

describe('FriendlyBooleanPipe', () => {
    const pipe = new FriendlyBooleanPipe();

    it('returns "Yes" if true', () => {
        expect(pipe.transform(true)).toBe('Yes');
    });

    it('returns "No" if false', () => {
        expect(pipe.transform(false)).toBe('No');
    });
});