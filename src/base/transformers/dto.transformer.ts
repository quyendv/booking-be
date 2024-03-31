// NOTE: transform function only called when value is not null or undefined

export function transformArray<T = any>({ value }: { value: T[] }): T[] {
  return Array.isArray(value) ? value : [value];
}

export function transformBoolean({ value }: { value: any }): boolean {
  return value === 'true' || value === true;
}
