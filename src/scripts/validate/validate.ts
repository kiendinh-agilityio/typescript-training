import { REGEX, VALIDATE_MESSAGES } from '@/constants';

const { INVALID_EMAIL, REQUIRED_ERROR, INVALID_PASSWORD, INVALID_CONFIRM_PASSWORD } = VALIDATE_MESSAGES;

const validateField = (value: string | undefined, fieldName: string, regex: RegExp, errorMessage: string): string | null =>
  !value ? REQUIRED_ERROR.replace('{field}', fieldName) : (!regex.test(value) ? errorMessage.replace('{field}', fieldName) : null);

export const validateEmailField = (email: string): string | null => validateField(email, 'Email', REGEX.EMAIL, INVALID_EMAIL);
export const validatePasswordField = (password: string): string | null => validateField(password, 'Password', REGEX.CHARACTERS, INVALID_PASSWORD);
export const validateConfirmPasswordField = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return REQUIRED_ERROR.replace('{field}', 'Confirm Password');
  } else if (password !== confirmPassword) {
    return INVALID_CONFIRM_PASSWORD;
  }
  return null;
};
