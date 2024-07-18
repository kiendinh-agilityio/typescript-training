// Import constant
import { DISPLAY_CLASSES } from '@/constants';

/**
 * Toggles the display of a dropdown element between 'flex' and 'hidden'.
 * @param element - The HTMLElement representing the dropdown element.
 */
export const toggleDropdown = (element: HTMLElement): void => {
  element.style.display =
    element.style.display === DISPLAY_CLASSES.FLEX
      ? DISPLAY_CLASSES.HIDDEN
      : DISPLAY_CLASSES.FLEX;
};

/**
 * @template T - Expected HTML element type.
 * @param {string} id/selector - ID or CSS selector of the element.
 * @returns {T} - The HTML element casted to type T.
 */
const getElementById = <T extends HTMLElement>(id: string): T =>
  document.getElementById(id) as T;

// Get the element with ID 'modal'
export const modalTeacher = getElementById('modal-add-teacher');
