// Message
export const VALIDATE_MESSAGES = {
  REQUIRED_ERROR: '{field} is required',
  INVALID_EMAIL: 'Invalid email. Please enter a valid email address',
  INVALID_PASSWORD: 'Invalid password. Password must have at least 8 characters, including at least one digit, one special character, one lowercase letter, and one uppercase letter.',
  INVALID_CONFIRM_PASSWORD: 'Password and Confirm Password do not match.',
};

// Login
export const LOGIN_MESSAGES = {
  SUCCESS: 'Sign in successfully',
  UNSUCCESSFUL: 'Sign in unsuccessful',
  EMPTY: 'Please enter both email and password.',
};

// Error Fetching
export const ERROR_FETCHING_DATA: string = 'Error fetching user data';

// Message Signup
export const SIGNUP_MESSAGES = {
  SUCCESS: 'Registration successful. You can now sign in.',
  EMAIL: 'Email already exists. Please use a different email.',
  EMPTY: 'Email, password, and confirm password are required.',
};

// Error Saving
export const ERROR_SAVING_DATA: string = 'Error saving user data';
