import { Person } from '@/interfaces';

// Create interface for validate
export type ConfigValidate = Partial<Person>;

// Create interface for errors
export interface Errors {
  [key: string]: string;
}
