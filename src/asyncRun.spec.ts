import { AsyncValidate, runAsyncValidations } from './asyncRun';
import { Invalid, InvalidOr, Validated } from './models';
import { areInvalid } from './typeGuards';

describe('runAsyncValidations', (): void => {
    interface Person { age: number }
    const above18: AsyncValidate<Person> = async (person): Promise<InvalidOr<Person>> =>
        person.age > 18 ? person : new Invalid('Not above 18');

    it('returns the original object when pass validation', (): void => {
        const john = { age: 24 };
        const run = runAsyncValidations([above18], john); // the type parameter is inferred

        run.then((result): Validated<Person> => expect(result).toStrictEqual(john));
    });

    it('returns an array of Invalid when fails validation', (): void => {
        const jane = { age: 18 };
        const run = runAsyncValidations([above18], jane);

        run.then((result): Validated<Person> => expect(result).toStrictEqual([ new Invalid('Not above 18') ]));
        run.then((result): boolean => expect(areInvalid(result)).toBe(true));
    });

    it('handles rejected Promise by validation function as Invalid', (): void => {
        const rejectWithPromise = (): Promise<InvalidOr<Person>> => Promise.reject('Rejected');

        const john = { age: 24 };
        const run = runAsyncValidations([rejectWithPromise], john);

        run.then((result): Validated<Person> => expect(result).toStrictEqual([ new Invalid('Rejected')]));
    });
});
