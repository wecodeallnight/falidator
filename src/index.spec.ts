import { runValidations } from './index';
import { Invalid, Validate, InvalidOr, AreInvalid } from './models';

describe('runValidations', (): void => {
    interface Person { age: number }
    const above18: Validate<Person> = (person): InvalidOr<Person> =>
        person.age > 18 ? person : new Invalid('Not above 18');

    it('returns the original object when pass validation', (): void => {
        const john = { age: 24 };
        const result = runValidations([above18], john); // the type parameter is inferred

        expect(result).toBe(john);
    });

    it('returns an array of Invalid when fails validation', (): void => {
        const jane = { age: 18 };
        const result = runValidations([above18], jane);

        expect(result).toStrictEqual([ new Invalid('Not above 18') ]);
        expect(AreInvalid(result)).toBe(true);
    });

    it('handles exception thrown by validation function as Invalid', (): void => {
        const throwException = (): InvalidOr<Person> => { throw new Error('Something bad happened'); };

        const john = { age: 24 };
        const result = runValidations([throwException], john);

        expect(result).toStrictEqual([ new Invalid('Something bad happened')]);
    });
});
