// Import the DISPLAY_CLASS constant
import { DISPLAY_CLASS } from '@/constants';

// Function to toggle the display of a dropdown element
export const toggleDropdown = (element: HTMLElement): void => {
  element.style.display = element.style.display === DISPLAY_CLASS.FLEX ? DISPLAY_CLASS.HIDDEN : DISPLAY_CLASS.FLEX;
};
