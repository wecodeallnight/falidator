import { Invalid, InvalidOr, Validated } from './models';
import { isStrictInvalid, areInvalid } from './typeGuards';

export type Validate<T> = (t: T) => InvalidOr<T>;
export type ValidateAll = <T>(fns: Validate<T>[], t: T) => Validated<T>;

export const runValidations: ValidateAll = <T>(fns, input): Validated<T> => {
    const validateResults: InvalidOr<T>[] = fns.map((fn): InvalidOr<T> => {
        let result;
        try {
            result = fn(input);
        } catch (error) {
            result = new Invalid(error.message);
        }
        return result;
    });

    const accumulateErrors = (accumulator: Invalid[], current: InvalidOr<T>): Invalid[] => {
        if (isStrictInvalid(current)) accumulator.push(current);
        return accumulator;
    };

    const errors: Invalid[] = validateResults.reduce(accumulateErrors, []);

    return areInvalid(errors) ? errors : input;
};
