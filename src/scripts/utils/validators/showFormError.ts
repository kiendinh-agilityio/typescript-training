// Import interfaces for errors
import { Errors } from '@/interfaces';

// Function to update error messages on the form
const updateErrorMessages = (errors: Errors): void => {
  Object.entries(errors).forEach(([key, value]) => {
    const target = document.getElementById(`${key}-error`);
    if (target) {
      // Ensure target.innerText is a string
      target.innerText = value || '';
    }
  });
};

// Function to show form errors by updating error messages
export const showFormErrors = (errors: Errors): void =>
  updateErrorMessages(errors);
