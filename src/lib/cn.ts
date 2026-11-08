export type ClassValue = string | false | null | undefined;

/** Une nombres de clase ignorando los valores falsy. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
