import { Person } from '@/types';

// Create interface for model validation
export type ModelValidation = Partial<Person> & {
  subject?: string;
};

// Create interface for errors
export interface Errors {
  [key: string]: string;
}
