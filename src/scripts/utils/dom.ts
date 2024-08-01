// Import constant
import { DISPLAY_CLASSES } from '@/constants';

/**
 * Toggles the display of a dropdown element between 'flex' and 'hidden'.
 * @param element - The HTMLElement representing the dropdown element.
 */
export const createToggleDropdown = (element: HTMLElement): void => {
  element.style.display =
    element.style.display === DISPLAY_CLASSES.FLEX
      ? DISPLAY_CLASSES.HIDDEN
      : DISPLAY_CLASSES.FLEX;
};

// Get the element with ID 'modal teacher'
export const getModalTeacher = document.getElementById('modal-add-teacher');

// Get the element with ID 'modal confirm delete teacher'
export const getModalDeleteTeacher = document.getElementById(
  'modal-confirm-teacher',
);

// Get the first element with id 'teacher-search'
export const getSearchTeacher = document.getElementById('teacher-search');

// Get the element with ID 'modal student'
export const getModalStudent = document.getElementById('modal-add-student');

// Get the element with ID 'modal confirm delete student'
export const getModalDeleteStudent = document.getElementById(
  'modal-confirm-student',
);

// Get the first element with id 'student-search'
export const getSearchStudent = document.getElementById('student-search');
