import { AsyncValidate, runAsyncValidations } from './asyncRun';
import { Invalid, InvalidOr } from './models';
import { areInvalid } from './typeGuards';

describe('runAsyncValidations', (): void => {
    interface Person { age: number }
    const above18: AsyncValidate<Person> = async (person): Promise<InvalidOr<Person>> =>
        person.age > 18 ? person : new Invalid('Not above 18');

    it('returns the original object when pass validation', (): void => {
        const john = { age: 24 };
        const run = runAsyncValidations([above18], john); // the type parameter is inferred

        run.then((result): void => expect(result).toStrictEqual(john));
    });

    it('returns an array of Invalid when fails validation', (): void => {
        const jane = { age: 18 };
        const run = runAsyncValidations([above18], jane);

        run.then((result): void => expect(result).toStrictEqual([ new Invalid('Not above 18') ]));
        run.then((result): void => expect(areInvalid(result)).toBe(true));
    });

    it('handles rejected Promises thrown by validation function as Invalid', (): void => {
        const rejectWithPromise = async (): Promise<InvalidOr<Person>> => Promise.reject('Rejected');
        const anotherRejectedPromise = async (): Promise<InvalidOr<Person>> => Promise.reject('Another rejection');

        const john = { age: 24 };
        const run = runAsyncValidations([rejectWithPromise, anotherRejectedPromise], john);

        run.then((result): void => expect(result).toStrictEqual(
            [ new Invalid('Rejected'), new Invalid('Another rejection') ]
        ));
    });

    it('handles Errors thrown by validation function as Invalid', (): void => {
        const throwError = async (): Promise<InvalidOr<Person>> => { throw new Error('Errored'); };
        const throwAnotherError = async (): Promise<InvalidOr<Person>> => { throw new Error('Another error'); };

        const john = { age: 24 };

        const run = runAsyncValidations([throwError, throwAnotherError], john);

        run.then((result): void => expect(result).toStrictEqual(
            [ new Invalid('Errored'), new Invalid('Another error') ]
        )).catch(console.error);
        // We need a catch here, because in the event of failed matcher, it will throw an Error
        // which needs to be catched. Otherwise there'll be a warning on Unhandled promise rejection
    });
});
