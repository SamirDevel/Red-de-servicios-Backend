import { ValidationOptions, registerDecorator, ValidationArguments } from "class-validator";

export function IsChar(charFn:Function, errorMssage:string, validationOptions?:ValidationOptions){
    return function(object:Object, propertyName:string){
        registerDecorator({
            name:'isChar',
            target:object.constructor,
            propertyName,
            options:validationOptions,
            validator:{
                validate(value:any, args:ValidationArguments){
                    return charFn(value)
                },
                defaultMessage(args:ValidationArguments){
                    return `${args.property} must be ${errorMssage}`;
                }
            }
        })
    }
}