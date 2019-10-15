import { Invalid, InvalidOr, Validated } from './models';
import { isStrictInvalid, areInvalid } from './typeGuards';

export type AsyncValidate<T> = (t: T) => Promise<InvalidOr<T>>;
export type AsyncValidateAll = <T>(fns: AsyncValidate<T>[], t: T) => Promise<Validated<T>>;

const turnCatchedIntoInvalid = (catchedError): Invalid => {
    let message = `catched error ${catchedError}`;
    if (catchedError.message !== undefined) message = catchedError.message;
    if (typeof catchedError == 'string') message = catchedError;
    return new Invalid(message);
};

export const runAsyncValidations: AsyncValidateAll = async <T>(asyncFunctions: AsyncValidate<T>[], input: T): Promise<Validated<T>> => {
    const eventualResults: Promise<InvalidOr<T>>[] = asyncFunctions.map(
        (fn): Promise<InvalidOr<T>> => { return fn(input); }
    );

    // We need to compose promises with catch because we don't want rejected Promise to bubble up
    const wrappedPromises: Promise<InvalidOr<T>>[] = eventualResults
        .map(
            (eventualResult): Promise<InvalidOr<T>> => eventualResult
                .catch(
                    // You cannot type what's catched here
                    // Because it can be Error or anything thrown by Promise.reject
                    (e): Invalid => { return turnCatchedIntoInvalid(e); }
                )
        );

    // Promise.all wait for all promise to resolve OR return the first rejected promise.
    // Which is not what we want, we want to collect all errors first
    // This is why we need to compose the promises with catch above
    const validateResults: InvalidOr<T>[] = await Promise.all<InvalidOr<T>>(wrappedPromises);

    const accumulateErrors = (accumulator: Invalid[], current: InvalidOr<T>): Invalid[] => {
        if (isStrictInvalid(current)) accumulator.push(current);
        return accumulator;
    };

    const errors: Invalid[] = validateResults.reduce<Invalid[]>(accumulateErrors, []);
    return areInvalid(errors) ? errors : input;
};
