import { Invalid, InvalidOr, Validated } from './models';

export type AsyncValidate<T> = (t: T) => Promise<InvalidOr<T>>;
export type AsyncValidateAll = <T>(fns: AsyncValidate<T>[], t: T) => Promise<Validated<T>>;

type ArrayOfInvalidOr = InvalidOr<{}>[]

export const runAsyncValidations: AsyncValidateAll = async <T>(fns, input): Promise<Validated<T>> => {
    const eventualResults = fns.map((fn): InvalidOr<{}> => {
        return fn(input);
    });

    // We need to compose promises with catch because we don't want rejected Promise to bubble up
    const wrappedPromises = eventualResults
        .map(
            (eventualResult): ArrayOfInvalidOr => eventualResult
                .catch(
                    // You cannot type what's catched here
                    // Because it can be Error or anything thrown by Promise.reject
                    (e): Invalid => {
                        // But just in case it's Error, we should take the message to form the Invalid
                        const invalidMessage = e.message ? e.message : e;
                        return new Invalid(invalidMessage);
                    }
                )
        );

    // Promise.all wait for all promise to resolve OR return the first rejected promise.
    // Which is not what we want, we want to collect all errors first
    // This is why we need to compose the promises with catch
    const validateResults: ArrayOfInvalidOr | Invalid = await Promise.all<ArrayOfInvalidOr>(wrappedPromises)
        .catch((e): Invalid => new Invalid(e.message));

    let errors: Invalid[] = [];

    if (validateResults instanceof Invalid) {
        console.log('Something went wrong while waiting for all async validations');
    // Unfortunately a simple else won't do
    // TS is unable to determine the type
    } else if (Array.isArray(validateResults)) {
        validateResults.forEach(
            (eos: Promise<InvalidOr<{}>>): void => {
                if (eos instanceof Invalid) errors.push(eos);
            }
        );
        return errors.length > 0 ? errors : input;
    }
};
