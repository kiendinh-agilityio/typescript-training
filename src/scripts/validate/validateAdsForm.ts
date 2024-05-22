// Import validate
import {
  validateEmailField,
  validateLinkField,
  validateNetworkField,
  validatePhoneField,
  validateStatusField,
} from '@/validate';

// Import interfaces
import { AdsData, ConfigValidateAds } from '@/interfaces';

export const validateAdsForm = (adsItem: AdsData): ConfigValidateAds => {
  const { email = '', phone = '', status = '', network = '', link = '' } = adsItem || {};

  const errors: ConfigValidateAds = {};

  const emailError = validateEmailField(email);
  if (emailError) {
    errors.email = emailError;
  }

  const phoneError = validatePhoneField(phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  const statusError = validateStatusField(status);
  if (statusError) {
    errors.status = statusError;
  }

  const networkError = validateNetworkField(network);
  if (networkError) {
    errors.network = networkError;
  }

  const linkError = validateLinkField(link);
  if (linkError) {
    errors.link = linkError;
  }

  return errors;
};
