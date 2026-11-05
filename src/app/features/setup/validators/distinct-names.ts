import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Group validator: fails with `{ duplicateNames: true }` when two of the given controls
 * hold the same name (case-insensitive, ignoring surrounding whitespace). Empty values are ignored.
 */
export function distinctNamesValidator(...controlNames: readonly string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const names = controlNames
      .map((name) => String(group.get(name)?.value ?? '').trim().toLocaleLowerCase())
      .filter(Boolean);
    return new Set(names).size < names.length ? { duplicateNames: true } : null;
  };
}
