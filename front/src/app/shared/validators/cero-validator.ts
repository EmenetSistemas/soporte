import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function invalidZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (value === null || value === undefined || value === '') {
            return { 'invalidNumber': { value: control.value } };
        }

        const cleanedValue = value.replace(/[^\d.-]/g, '');

        const parsedValue = parseFloat(cleanedValue);

        if (isNaN(parsedValue) || parsedValue <= 0) {
            return { 'invalidNumber': { value: control.value } };
        }

        return null;
    };
}