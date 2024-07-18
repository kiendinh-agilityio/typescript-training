// Import interfaces for errors
import { Errors } from '@/interfaces';

// Function to update error messages on the form
const updateErrorMessages = (errors: Errors): void => {
  Object.entries(errors).forEach(([key, value]) => {
    const errorTarget = document.getElementById(`${key}-error`);

    // If errorTarget exists, set its innerText to `value` or an empty string if `value` is falsy.
    if (errorTarget) {
      errorTarget.innerText = value || '';
    }
  });
};

// Function to show form errors by updating error messages
export const showFormErrors = (errors: Errors): void =>
  updateErrorMessages(errors);
