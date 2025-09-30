export function hasProp<T extends object>(obj: T, prop: keyof any): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
