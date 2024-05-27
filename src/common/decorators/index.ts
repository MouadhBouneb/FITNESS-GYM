import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

export function IsDateGreaterThanNow(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDateGreaterThanNow',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            return false;
          }
          const currentDate = new Date();
          const providedDate = new Date(value);
          return (
            providedDate.toISOString().split('T')[0] >= currentDate.toISOString().split('T')[0]
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be greater than or equal to the current date`;
        }
      }
    });
  };
}

export function IsDateGreaterThanOrEqualTo(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDateGreaterThanOrEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[property];
          if (!relatedValue || !value) return true;
          return new Date(value) >= new Date(relatedValue);
        },
        defaultMessage(args: ValidationArguments) {
          const relatedProperty = args.constraints[0];
          return `${args.property} must be greater than or equal to ${relatedProperty}`;
        }
      }
    });
  };
}

export function IsOneOfDefined(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isOneOfDefined',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsOneOfDefinedConstraint
    });
  };
}

@ValidatorConstraint({ name: 'isOneOfDefined', async: false })
export class IsOneOfDefinedConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const city = (args.object as any).City;
    const hotel = (args.object as any).Hotel;
    return city !== undefined || hotel !== undefined;
  }
  defaultMessage() {
    return `Either City or Hotel should be defined`;
  }
}

export function IsOneOrTwo(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isOneOrTwo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === 1 || value === 2;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be either 1 or 2`;
        }
      }
    });
  };
}
