import { Person } from '@/interfaces';

// Create interface for validate
export type PartialValidate = Partial<Person>;

// Create interface for errors
export interface Errors {
  [key: string]: string;
}
