import { Validate, runValidations, AreErrors } from "./index"

describe("runValidations", () => {
  interface Person { age: number; }
  const above18: Validate<Person> = (person) => 
    person.age > 18 ? person : { errorMessage: "not above 18" }      
  
  it("returns the original object when pass validation", function() {          
    const john = { age: 24 }
    const result = runValidations([above18], john)
      
    expect(result).toBe(john);
  }); 

  it("returns an array of Invalid when fails validation", function() {          
    const jane = { age: 18 }
    const result = runValidations([above18], jane)
      
    expect(result).toStrictEqual([{ errorMessage: "not above 18" }]);
    expect(AreErrors(result)).toBe(true);
  }); 
});