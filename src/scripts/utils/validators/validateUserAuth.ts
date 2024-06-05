// Import validation functions for email, password, and confirm password fields
import { validateEmailField, validatePasswordField, validateConfirmPasswordField } from '@/utils';

// Define interface for user
interface User {
  email: string;
  password: string;
  confirmPassword: string;
}

// Define interface for errors
interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Function to validate user authentication data
export const validateUserAuthen = (user: User): Errors => {
  // Destructure user object to extract email, password, and confirmPassword
  const { email, password, confirmPassword } = user;

  // Initialize an empty object to store validation errors
  const errors: Errors = {};

  // Validate the email field and store any error message
  const emailError = validateEmailField(email);
  if (emailError) {
    errors.email = emailError;
  }

  // Validate the password field and store any error message
  const passwordError = validatePasswordField(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  // Validate the confirm password field and store any error message
  const confirmPasswordError = validateConfirmPasswordField(password, confirmPassword);
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  // Return the errors object containing any validation errors
  return errors;
};
