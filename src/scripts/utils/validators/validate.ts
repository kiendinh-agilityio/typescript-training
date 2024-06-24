// Import regular expressions and validation messages
import { REGEX, VALIDATE_MESSAGES } from '@/constants';

// Destructure validation messages for easier access
const {
  INVALID_EMAIL,
  REQUIRED_ERROR,
  INVALID_PASSWORD,
  INVALID_CONFIRM_PASSWORD,
  INVALID_LINK,
  INVALID_PHONE,
  INVALID_NETWORK,
} = VALIDATE_MESSAGES;

// Function to validate a field based on a regex pattern
const validateField = (
  value: string | undefined,
  fieldName: string,
  regex: RegExp,
  errorMessage: string,
): string | null =>
  !value
    ? REQUIRED_ERROR.replace('{field}', fieldName)
    : !regex.test(value)
      ? errorMessage.replace('{field}', fieldName)
      : null;

// Function to validate an email field
export const validateEmailField = (email: string): string | null =>
  validateField(email, 'Email', REGEX.EMAIL, INVALID_EMAIL);

// Function to validate a password field
export const validatePasswordField = (password: string): string | null =>
  validateField(password, 'Password', REGEX.CHARACTERS, INVALID_PASSWORD);

// Function to validate a confirm password field
export const validateConfirmPasswordField = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) {
    return REQUIRED_ERROR.replace('{field}', 'Confirm password');
  } else if (password !== confirmPassword) {
    return INVALID_CONFIRM_PASSWORD;
  }

  return null;
};

// Function to validate a network field
export const validateNetworkField = (network: string): string | null =>
  validateField(network, 'Network', REGEX.NETWORK, INVALID_NETWORK);

// Function to validate a phone field
export const validatePhoneField = (phone: string): string | null =>
  validateField(phone, 'Mobile No', REGEX.PHONE, INVALID_PHONE);

// Function to validate a status field
export const validateStatusField = (
  status: string | undefined,
): string | null =>
  !status ? REQUIRED_ERROR.replace('{field}', 'Status Type') : null;

// Function to validate a link field
export const validateLinkField = (link: string): string | null =>
  validateField(link, 'Link', REGEX.LINK, INVALID_LINK);
