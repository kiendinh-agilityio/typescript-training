export const strimmingString = <T>(value: T): T extends string ? string : T => {
  return (typeof value === 'string' ? value.trim() : value) as T extends string
    ? string
    : T;
};
