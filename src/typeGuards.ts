import { InvalidOr, Invalid, Validated, NonEmptyArray } from './models';

type IsInvalidTypeGuard<T> = (errorOrT: InvalidOr<T>) => errorOrT is Invalid;
// What is {} here? It's an  empty binding pattern
// which is currently used as workaround for anonymous parameter
// For more information see: https://github.com/Microsoft/TypeScript/issues/5586
export const isInvalid: IsInvalidTypeGuard<{}> = (errorOrT): errorOrT is Invalid => {
    return (errorOrT as Invalid).errorMessage !== undefined;
};

type AreInvalidTypeGuard<T> = (validatedT: Validated<T>) => validatedT is NonEmptyArray<Invalid>;
export const areInvalid: AreInvalidTypeGuard<{}> = (validatedT): validatedT is NonEmptyArray<Invalid> => {
    return (validatedT as Invalid[]).filter((e): boolean => e.errorMessage !== undefined).length > 0;
};
