// Import constants regex
import { REGEX } from '@/constants';

// Function to format a phone number string
const formatPhoneNumber = (phoneNumber: string): string => phoneNumber.length >= 10
    ? `(${phoneNumber.slice(0, 3)})-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    : phoneNumber;

// Function to format and limit phone number input
export const formatLimitedPhoneNumberInput = (event: Event): void => {
  const inputElement = event.target as HTMLInputElement;
  const phoneNumber = inputElement.value;

  // Remove any non-numeric characters from the input
  const cleanPhoneNumber = phoneNumber.replace(REGEX.NON_NUMERIC, '');

  // Limit phone numbers to a maximum of 10 numbers
  if (cleanPhoneNumber.length > 10) {
    inputElement.value = inputElement.value.slice(0, -1);
  } else {
    inputElement.value = formatPhoneNumber(cleanPhoneNumber);
  }
};
