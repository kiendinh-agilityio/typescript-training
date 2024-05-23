// Message
export const VALIDATE_MESSAGES: { [key: string]: string } = {
  REQUIRED_ERROR: '{field} is required',
  INVALID_EMAIL: 'Invalid email. Please enter a valid email address',
  INVALID_PASSWORD: 'Invalid password. Password must have at least 8 characters',
  INVALID_CONFIRM_PASSWORD: 'Password and Confirm Password do not match.',
  INVALID_NETWORK: 'Please enter a minimum of 4 and a maximum of 20 characters for the network',
  INVALID_PHONE: 'Invalid phone number. Please enter a valid phone number. Example: (205)-205-5555',
  INVALID_LINK: 'Please enter a valid link.',
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

// Message
export const MESSAGES: { [key: string]: string } = {
  REQUEST_FAILED: 'Request failed!',
  NO_RESULT: 'No results were found!',
  DELETE_SUCCESS: 'You have deleted it successfully!',
  DELETE_ERROR: 'Failed to delete ads with id!',
  ADD_ERROR: 'Failed to add new ads!',
  ADD_SUCCESS: 'You have added it successfully!',
  EDIT_ERROR: 'Failed to edit ads!',
  EDIT_SUCCESS: 'You have edited it successfully!',
  GET_DETAIL_ID_ERROR: 'Failed to get detail id ads!',
  NO_CHANGES: 'No changes were made!',
};
