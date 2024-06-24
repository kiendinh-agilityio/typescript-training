// Import validation functions
import {
  validateEmailField,
  validateLinkField,
  validateNetworkField,
  validatePhoneField,
  validateStatusField,
} from '@/utils';

// Import interfaces
import { AdsData, ConfigValidateAds } from '@/interfaces';

// Function to validate an ads form
export const validateAdsForm = (adsItem: AdsData): ConfigValidateAds => {
  // Destructure the adsItem properties with default empty strings
  const {
    email = '',
    phone = '',
    status = '',
    network = '',
    link = '',
  } = adsItem || {};

  // Initialize an object to hold validation errors
  const errors: ConfigValidateAds = {};

  // Validate the email field and add an error if validation fails
  const emailError = validateEmailField(email);
  if (emailError) {
    errors.email = emailError;
  }

  // Validate the phone field and add an error if validation fails
  const phoneError = validatePhoneField(phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  // Validate the status field and add an error if validation fails
  const statusError = validateStatusField(status);
  if (statusError) {
    errors.status = statusError;
  }

  // Validate the network field and add an error if validation fails
  const networkError = validateNetworkField(network);
  if (networkError) {
    errors.network = networkError;
  }

  // Validate the link field and add an error if validation fails
  const linkError = validateLinkField(link);
  if (linkError) {
    errors.link = linkError;
  }

  // Return the object containing all validation errors
  return errors;
};
