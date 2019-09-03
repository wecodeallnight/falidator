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

export type NonEmptyArray<T> = [T, ...T[]];
export type Validated<T> = NonEmptyArray<Invalid> | T;
export type ValidateAll = <T>(fns: Validate<T>[], t: T) => Validated<T>;
