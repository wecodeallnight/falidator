[![Build Status](https://travis-ci.com/wecodeallnight/falidator.svg?branch=master)](https://travis-ci.com/wecodeallnight/falidator)

# Falidator

Make running validations against a JavaScript value fun again, because:
- Run multiple validations at the same time and collate the result
- No `if` and no dependencies to run
- Any exception thrown by validation function, is quickly handled as `Invalid`
- Typed with typescript


### JavaScript sample

```js
const above18 = (person) => 
    person.age > 18 ? person : { errorMessage: "not above 18" };

const john = { age: 24 }
falidator.runValidations([above18], john) // returns  { age: 24 }

const jane = { age: 18 }
falidator.runValidations([above18], jane) // returns [{ errorMessage: "not above 18" }]
```


### TypeScript sample - synchronous

```js
interface Person { age: number; };

const above18: Validate<Person> = (person) => 
    person.age > 18 ? person : { errorMessage: "Not above 18" };

const john = { age: 24 };
runValidations([above18], john); // returns  { age: 24 }

const jane = { age: 18 };
runValidations([above18], jane); // returns [{ errorMessage: "not above 18" }]
```


### Type Script sample - asynchronous

```js
const isAllowed = async (person: Person): Promise<InvalidOr<Person>> => {
    const allowed = (person.name === 'Banned') ? new Invalid("Must not be in the banned list") : person;
    return allowed;
};

const nonEmptyName: EventuallyValidate<Person> = async (person: Person) => {
    return  (person.name !== "") ? person : new Invalid('Name cannot be empty')
};

const jack = { name: "Jack" };
runAsyncValidations([isAllowed, nonEmptyName], jack); // returns { name: Jack }

const banned = { name: "Banned" };
runAsyncValidations([isAllowed, nonEmptyName], banned) // returns [{errorMessage: "Must not be in the banned list" }]
```
