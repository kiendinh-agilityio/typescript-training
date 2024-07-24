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

// Get the element with ID 'modal teacher'
export const modalTeacher = document.getElementById('modal-add-teacher');

// Get the element with ID 'modal confirm delete teacher'
export const confirmModalTeacher = document.getElementById(
  'modal-confirm-teacher',
);

// Get the first element with id 'teacher-search'
export const teacherSearchElement = document.getElementById('teacher-search');
