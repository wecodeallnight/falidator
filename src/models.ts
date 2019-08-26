export interface Invalid {
    errorMessage: string;
}

export const Invalid = class implements Invalid {
    public errorMessage: string;
    public constructor(message: string) {
        this.errorMessage = message;
    }
};

export type InvalidOr<T> = Invalid | T;
export type Validate<T> = (t: T) => InvalidOr<T>;
export type Validated<T> = Invalid[] | T;
export type ValidateAll = <T>(fns: Validate<T>[], t: T) => Validated<T>;

type IsInvalidTypeGuard<T> = (errorOrT: InvalidOr<T>) => errorOrT is Invalid;
// What is {} here? It's an  empty binding pattern
// which is currently used as workaround for anonymous parameter
// For more information see: https://github.com/Microsoft/TypeScript/issues/5586
export const isInvalid: IsInvalidTypeGuard<{}> = (errorOrT): errorOrT is Invalid => {
    return (errorOrT as Invalid).errorMessage !== undefined;
};

type AreInvalidTypeGuard<T> = (validatedT: Validated<T>) => validatedT is Invalid[];
export const AreInvalid: AreInvalidTypeGuard<{}> = (validatedT): validatedT is Invalid[] => {
    return (validatedT as Invalid[]).filter((e): boolean => e.errorMessage !== undefined).length > 0;
};
