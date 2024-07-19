// Import regular expressions and validation messages
import { REGEX, VALIDATE_MESSAGES } from '@/constants';

// Destructure validation messages for easier access
const {
  INVALID_EMAIL,
  REQUIRED_ERROR,
  INVALID_NAME,
  INVALID_SUBJECT,
  INVALID_AVATAR_URL,
} = VALIDATE_MESSAGES;

// Function to validate a field based on a regex pattern
const validateField = (
  value?: string,
  fieldName?: string,
  regex?: RegExp,
  errorMessage?: string,
): string =>
  !value
    ? REQUIRED_ERROR(fieldName)
    : !regex.test(value)
    ? errorMessage.replace('{field}', fieldName)
    : null;

// Function to validate an email field
export const validateEmailField = (email: string): string =>
  validateField(email, 'Email', REGEX.EMAIL, INVALID_EMAIL);

// Function to validate a name field
export const validateNameField = (name: string): string =>
  validateField(name, 'Name', REGEX.CHARACTER, INVALID_NAME);

// Function to validate a subject field
export const validateSubjectField = (subject: string): string =>
  validateField(subject, 'Subject', REGEX.CHARACTER, INVALID_SUBJECT);

// Function to validate a class field
export const validateClassField = (className: string): string =>
  !className && REQUIRED_ERROR('Class');

// Function to validate a avatarUrl field
export const validateAvatarField = (avatarUrl: string): string =>
  validateField(avatarUrl, 'Avatar url', REGEX.AVATAR_URL, INVALID_AVATAR_URL);

// Function to validate a gender field
export const validateGenderField = (gender: string): string =>
  !gender && REQUIRED_ERROR('Gender');
