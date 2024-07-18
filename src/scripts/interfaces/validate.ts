// Create interface for validate
export interface ConfigValidate {
  name?: string;
  email?: string;
  className?: string;
  subject?: string;
  gender?: string;
  avatarUrl?: string;
  [key: string]: string;
}

// Create interface for errors
export interface Errors {
  [key: string]: string;
}
