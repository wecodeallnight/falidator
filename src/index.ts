interface Error {
  errorMessage: string;
}

export type ErrorOr<T> = Error | T;
export type Validate<T> = (t: T) => ErrorOr<T>;
export type Validated<T> = Error[] | T;
type ValidateAll<T> = (fns: Validate<T>[], t: T) => Validated<T>;

type IsErrorTypeGuard<T> = (errorOrT: ErrorOr<T>) => errorOrT is Error;
export const isError: IsErrorTypeGuard<any> = (errorOrT): errorOrT is Error => {
  return (errorOrT as Error).errorMessage !== undefined;
};

type AreErrorsTypeGuard<T> = (validatedT: Validated<T>) => validatedT is Error[];
export const AreErrors: AreErrorsTypeGuard<any> = (validatedT): validatedT is Error[] => {
  return (validatedT as Error[]).filter(e => e.errorMessage !== undefined).length > 0;
};

export const runValidations: ValidateAll<any> = (fns, input): Validated<any> => {
  const x = fns.map((fn) => fn(input));

  let errors: Error[] = [];
  x.forEach(
    (eos: ErrorOr<any>): void => {
      if (isError(eos)) errors.push(eos);
    }
  );

  return errors.length > 0 ? errors : input;
};