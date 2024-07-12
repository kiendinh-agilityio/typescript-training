// Create interface for Person data
export interface Person {
  id: string;
  name: string;
  email: string;
  className: string;
  gender: string;
  avatar: string;
}

export interface Teacher extends Person {
  subject: string;
}

export interface Student extends Person {
  studentId: string;
}
