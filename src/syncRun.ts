import { Invalid, InvalidOr, Validated } from './models';

export type Validate<T> = (t: T) => InvalidOr<T>;
export type ValidateAll = <T>(fns: Validate<T>[], t: T) => Validated<T>;

export const runValidations: ValidateAll = <T>(fns, input): Validated<T> => {
    const validateResults = fns.map((fn): InvalidOr<{}> => {
        let result;
        try {
            result = fn(input);
        } catch (error) {
            result = new Invalid(error.message);
        }
        return result;
    });

    let errors: Invalid[] = [];
    validateResults.forEach(
        (eos: InvalidOr<{}>): void => {
            if (eos instanceof Invalid) errors.push(eos);
        }
    );

    return errors.length > 0 ? errors : input;
};
