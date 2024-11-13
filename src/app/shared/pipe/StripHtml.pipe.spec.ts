import { StripHtmlPipe } from "./StripHtml.pipe";

describe('StripHthmlPipe', () => {
    const pipe = new StripHtmlPipe();

    it('returns empty string if no value provided', () => {
        expect(pipe.transform(null)).toBe('');
    });

    it('replaces <br/> with "" in a given string', () => {
        expect(pipe.transform('<h1>Hello</h1><br/><h1>World</h1>')).toBe('<h1>Hello</h1><h1>World</h1>');
    });
});