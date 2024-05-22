// Format Phone Number
const formatPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber.length >= 10) {
    return `(${phoneNumber.slice(0, 3)})-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }

  return phoneNumber;
};

export const formatLimitedPhoneNumberInput = (event: Event): void => {
  const inputElement = event.target as HTMLInputElement;
  const phoneNumber = inputElement.value;
  const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');

  // Limit phone numbers to a maximum of 10 numbers
  if (cleanPhoneNumber.length > 10) {
    inputElement.value = inputElement.value.slice(0, -1);
  } else {
    inputElement.value = formatPhoneNumber(cleanPhoneNumber);
  }
};
