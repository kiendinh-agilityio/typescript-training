// Import the Teacher interface
import { Person, Teacher } from '@/types';

/**
 * Type guard function to check if a given item is of type `Teacher`.
 * @param item - The `Person` or `Teacher` object to be checked.
 * @returns A boolean indicating whether the item is a `Teacher`.
 */
export const isItemTeacher = (item: Person | Teacher): item is Teacher => {
  return (item as Teacher)?.subject !== undefined;
};
