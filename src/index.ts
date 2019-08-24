interface Invalid {
    errorMessage: string;
}

export type InvalidOr<T> = Invalid | T;
export type Validate<T> = (t: T) => InvalidOr<T>;
export type Validated<T> = Invalid[] | T;
type ValidateAll<T> = (fns: Validate<T>[], t: T) => Validated<T>;

type IsErrorTypeGuard<T> = (errorOrT: InvalidOr<T>) => errorOrT is Invalid;
export const isError: IsErrorTypeGuard<any> = (errorOrT): errorOrT is Invalid => {
    return (errorOrT as Invalid).errorMessage !== undefined;
};

type AreErrorsTypeGuard<T> = (validatedT: Validated<T>) => validatedT is Invalid[];
export const AreErrors: AreErrorsTypeGuard<any> = (validatedT): validatedT is Invalid[] => {
    return (validatedT as Invalid[]).filter((e): boolean => e.errorMessage !== undefined).length > 0;
};

export const runValidations: ValidateAll<any> = (fns, input): Validated<any> => {
    const validateResults = fns.map((fn): InvalidOr<any> => fn(input));

    let errors: Invalid[] = [];
    validateResults.forEach(
        (eos: InvalidOr<any>): void => {
            if (isError(eos)) errors.push(eos);
        }
    );

    return errors.length > 0 ? errors : input;
};
