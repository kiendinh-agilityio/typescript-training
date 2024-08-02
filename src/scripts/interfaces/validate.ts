import { Person } from '@/interfaces';

// Create interface for validation error
export type PersonValidationError = Partial<Person>;

// Create interface for errors
export interface Errors {
  [key: string]: string;
}
