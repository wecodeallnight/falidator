import { Invalid } from './models';
import { isInvalid, areInvalid, isStrictInvalid } from './typeGuards';

describe('isInvalid', (): void => {
    it('returns true for object created from Invalid class', (): void => {
        const myBad = new Invalid('Oops');
        expect(isInvalid(myBad)).toBe(true);
        expect(isStrictInvalid(myBad)).toBe(true);

    });

    it('returns true for object with data structure matching Invalid class', (): void => {
        const myBad = { errorMessage: 'Oops'};
        expect(isInvalid(myBad)).toBe(true);
        expect(isStrictInvalid(myBad)).toBe(false);
    });
});

describe('isStrictInvalid', (): void => {
    it('returns true for object created from Invalid class', (): void => {
        const myBad = new Invalid('Oops');
        expect(isStrictInvalid(myBad)).toBe(true);

    });

    it('returns false for object with data structure matching Invalid class', (): void => {
        const myBad = { errorMessage: 'Oops'};
        expect(isStrictInvalid(myBad)).toBe(false);
    });
});

describe('AreErrors', (): void => {
    it('returns true for array of Invalids', (): void => {
        const myErrors = [ new Invalid('Oops') ];
        expect(areInvalid(myErrors)).toBe(true);
    });

    it('returns true for array of objects that has data structure matching Invalid class', (): void => {
        const myErrors = [ { errorMessage: 'Oops'} ];
        expect(areInvalid(myErrors)).toBe(true);
    });

    it('returns false for empty array', (): void => {
        const myErrors = [];
        expect(areInvalid(myErrors)).toBe(false);
    });
});
