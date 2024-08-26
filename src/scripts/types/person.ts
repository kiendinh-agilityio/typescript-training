// Create interface for Person data
export interface Person {
  id: string;
  name: string;
  email: string;
  className: string;
  gender: string;
  avatarUrl: string;
}

// Create interface for Teacher
export interface Teacher extends Person {
  subject: string;
}

// Create interface for form data input, extending from Person
export interface PersonFormData extends Partial<Person> {
  subject?: string;
  hasAdditionalField?: boolean;
}
