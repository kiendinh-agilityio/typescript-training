import { validateEmailField, validatePasswordField } from '@/validate';

interface User {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

export const validateUserAuthen = (user: User): Errors => {
  const { email, password } = user;

  const errors: Errors = {};

  const emailError = validateEmailField(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePasswordField(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};
