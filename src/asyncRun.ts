import { Invalid, InvalidOr, Validated } from './models';
import { isStrictInvalid } from './typeGuards';

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
    // This is why we need to compose the promises with catch above

    // We might still need `catch` here to avoid Unhandled Promise rejection warning
    const validateResults: ArrayOfInvalidOr = await Promise.all<ArrayOfInvalidOr>(wrappedPromises);

    let errors: Invalid[] = [];

    validateResults.forEach(
        (eos: Promise<InvalidOr<{}>>): void => {
            if (isStrictInvalid(eos)) errors.push(eos);
        }
    );
    return errors.length > 0 ? errors : input;
};
