import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ name: 'ObjectID', async: false })
export class IsValidIdConstraint implements ValidatorConstraintInterface {
  validate(value, args: ValidationArguments) {
    console.log('?', value, args);
    const isValid = mongoose.Types.ObjectId.isValid(value);
    console.log('is valid objectId: ', isValid);
    return isValid;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Id is not valid ObjectId';
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidIdConstraint,
    });
  };
}
