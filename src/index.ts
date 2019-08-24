interface Invalid {
    errorMessage: string;
}

export type InvalidOr<T> = Invalid | T;
export type Validate<T> = (t: T) => InvalidOr<T>;
export type Validated<T> = Invalid[] | T;
type ValidateAll<T> = (fns: Validate<T>[], t: T) => Validated<T>;

type IsErrorTypeGuard<T> = (errorOrT: InvalidOr<T>) => errorOrT is Invalid;
// What is {} here? It's an  empty binding pattern
// which is currently used as workaround for anonymous parameter
// For more information see: https://github.com/Microsoft/TypeScript/issues/5586
export const isError: IsErrorTypeGuard<{}> = (errorOrT): errorOrT is Invalid => {
    return (errorOrT as Invalid).errorMessage !== undefined;
};

type AreErrorsTypeGuard<T> = (validatedT: Validated<T>) => validatedT is Invalid[];
export const AreErrors: AreErrorsTypeGuard<{}> = (validatedT): validatedT is Invalid[] => {
    return (validatedT as Invalid[]).filter((e): boolean => e.errorMessage !== undefined).length > 0;
};

export const runValidations: ValidateAll<{}> = (fns, input): Validated<{}> => {
    const validateResults = fns.map((fn): InvalidOr<{}> => fn(input));

    let errors: Invalid[] = [];
    validateResults.forEach(
        (eos: InvalidOr<{}>): void => {
            if (isError(eos)) errors.push(eos);
        }
    );

    return errors.length > 0 ? errors : input;
};
