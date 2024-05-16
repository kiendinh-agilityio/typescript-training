import { validateEmailField, validatePasswordField, validateConfirmPasswordField } from '@/validate';

interface User {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateUserAuthen = (user: User): Errors => {
  const { email, password, confirmPassword } = user;

  const errors: Errors = {};

  const emailError = validateEmailField(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePasswordField(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validateConfirmPasswordField(password, confirmPassword);
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return errors;
};
