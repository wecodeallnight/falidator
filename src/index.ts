import { Invalid, InvalidOr, ValidateAll, Validated } from './models';

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
