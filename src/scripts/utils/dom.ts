// Import constant
import { IMAGE_BASE_PATH, DISPLAY_CLASS } from '@/constants';

/**
 * Handles toggling the visibility of a password input field.
 * Toggles between displaying the password as plain text and masking it.
 * @param togglePasswordButton - The button element used to toggle password visibility.
 */
export const handleTogglePassword = (togglePasswordButton: HTMLElement) => {
  const inputField = togglePasswordButton.parentElement!.querySelector(
    '.show-password',
  ) as HTMLInputElement;
  const eyeImage = togglePasswordButton.querySelector(
    'img',
  ) as HTMLImageElement;
  const isShow = inputField.getAttribute('data-show-password') === 'show';

  // Determine the source of the eye image based on whether the password is shown or hidden
  const eyeImageSrc = isShow
    ? IMAGE_BASE_PATH.EYE_KEY_PASSWORD
    : IMAGE_BASE_PATH.EYE_PASSWORD;
  eyeImage.src = eyeImageSrc;

  // Toggle the input field type between 'password' and 'text'
  inputField.type = isShow ? 'password' : 'text';
  inputField.setAttribute('data-show-password', isShow ? 'hidden' : 'show');
};

/**
 * Toggles the display of a dropdown element between 'flex' and 'hidden'.
 * @param element - The HTMLElement representing the dropdown element.
 */
export const toggleDropdown = (element: HTMLElement): void => {
  element.style.display =
    element.style.display === DISPLAY_CLASS.FLEX
      ? DISPLAY_CLASS.HIDDEN
      : DISPLAY_CLASS.FLEX;
};

/**
 * @template T - Expected HTML element type.
 * @param {string} id/selector - ID or CSS selector of the element.
 * @returns {T} - The HTML element casted to type T.
 */
const getElementById = <T extends HTMLElement>(id: string): T =>
  document.getElementById(id) as T;

const querySelector = <T extends HTMLElement>(selector: string): T =>
  document.querySelector(selector) as T;

// Get the element with ID 'authen-section'
export const authSection = getElementById<HTMLDivElement>('authen-section');

// Get the first element with class 'ads-search'
export const adsSearchElement = querySelector<HTMLDivElement>('.ads-search');

// Get the element with ID 'modal'
export const modalAds = getElementById('modal');
export const deleteModal = getElementById('delete-modal');
