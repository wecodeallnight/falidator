# Falidator

Make running validations against a JavaScript value fun again, because:
- Run multiple validations at the same time and collate the result
- No `if` and no dependencies to run
- Typed with typescript

Sample usage
```js
interface Person { age: number; }

const above18: Validate<Person> = (person) => 
    person.age > 18 ? person : { errorMessage: "not above 18" }

const john = { age: 24 }
runValidations([above18], john) // returns  [{ age: 24 }]

const jane = { age: 18 }
runValidations([above18], jane) // returns [{ errorMessage: "not above 18" }]
```
