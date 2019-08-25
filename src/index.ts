import { Invalid, InvalidOr, ValidateAll, Validated, isInvalid } from './models';

export const runValidations: ValidateAll<{}> = (fns, input): Validated<{}> => {
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
