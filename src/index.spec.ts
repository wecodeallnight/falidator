import { Validate, runValidations, AreErrors, InvalidOr } from './index';

describe('runValidations', (): void => {
    interface Person { age: number }
    const above18: Validate<Person> = (person): InvalidOr<Person> => 
        person.age > 18 ? person : { errorMessage: 'not above 18' };
  
    it('returns the original object when pass validation', (): void => {          
        const john = { age: 24 };
        const result = runValidations([above18], john);
      
        expect(result).toBe(john);
    }); 

    it('returns an array of Invalid when fails validation', (): void => {          
        const jane = { age: 18 };
        const result = runValidations([above18], jane);
      
        expect(result).toStrictEqual([{ errorMessage: 'not above 18' }]);
        expect(AreErrors(result)).toBe(true);
    }); 
});
