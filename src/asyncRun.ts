import { Invalid, InvalidOr, Validated } from './models';

export type AsyncValidate<T> = (t: T) => Promise<InvalidOr<T>>;
export type AsyncValidateAll = <T>(fns: AsyncValidate<T>[], t: T) => Promise<Validated<T>>;
export const runAsyncValidations: AsyncValidateAll = async <T>(fns, input): Promise<Validated<T>> => {
    const eventualResults = fns.map((fn): InvalidOr<{}> => {
        return fn(input);
    });

    const validateResults: InvalidOr<{}>[] = await Promise.all(eventualResults);

    let errors: Invalid[] = [];
    validateResults.forEach(
        (eos: Promise<InvalidOr<{}>>): void => {
            if (eos instanceof Invalid) errors.push(eos);
        }
    );
    return errors.length > 0 ? errors : input;
};
