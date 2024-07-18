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
  value?: string | undefined,
  fieldName?: string,
  regex?: RegExp,
  errorMessage?: string,
): string | null =>
  !value
    ? REQUIRED_ERROR(fieldName)
    : !regex.test(value)
    ? errorMessage.replace('{field}', fieldName)
    : null;

// Function to validate an email field
export const validateEmailField = (email: string): string | null =>
  validateField(email, 'Email', REGEX.EMAIL, INVALID_EMAIL);

// Function to validate a name field
export const validateNameField = (name: string): string | null =>
  validateField(name, 'Name', REGEX.CHARACTER, INVALID_NAME);

// Function to validate a subject field
export const validateSubjectField = (subject: string): string | null =>
  validateField(subject, 'Subject', REGEX.CHARACTER, INVALID_SUBJECT);

// Function to validate a class field
export const validateClassField = (
  className: string | undefined,
): string | null => (!className ? REQUIRED_ERROR('Class') : null);

// Function to validate a avatarUrl field
export const validateAvatarField = (avatarUrl: string): string | null =>
  validateField(avatarUrl, 'Avatar url', REGEX.AVATAR_URL, INVALID_AVATAR_URL);

// Function to validate a gender field
export const validateGenderField = (
  gender: string | undefined,
): string | null => (!gender ? REQUIRED_ERROR('Gender') : null);
