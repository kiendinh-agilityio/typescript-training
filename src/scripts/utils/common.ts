// Import the constant
import { CLASS_LIST, DISPLAY_CLASSES, TIMES } from '@/constants';

// Import the Teacher interface
import { Person } from '@/interfaces';

/**
 * Generates HTML markup for a modal form to manage advertisements.
 * @param item - Object containing advertisement data (optional).
 * @param title - Optional title for the modal (default: 'Add' if no ID is provided, otherwise 'Edit').
 * @returns HTML string for the modal form.
 */
/**
 * Generates HTML markup for a modal form to manage people (teachers or students).
 * @param item - Object containing person data (optional).
 * @param title - Optional title for the modal (default: 'Add' if no ID is provided, otherwise 'Edit').
 * @param isTeacher - Boolean indicating whether the modal is for a teacher (default: true).
 * @returns HTML string for the modal form.
 */
export const generatePersonModal = (
  item: Person,
  title?: string,
  isTeacher: boolean = true,
): string => {
  // Destructure properties from the item object with default values
  const {
    id = '',
    name = '',
    subject = '',
    email = '',
    avatarUrl = '',
    className = '',
    gender = '',
  } = item || {};

  // Generate class options
  const classOptions = CLASS_LIST.map(
    (cls) => `
    <option value="${cls}" ${
      className === cls ? 'selected' : ''
    }>${cls}</option>
  `,
  ).join('');

  // Return the HTML string for the modal form
  return `
    <div class="modal-content">
      <div class="modal-header flex-row justify-between items-center">
        <h2 class="modal-heading">
          ${title || (id ? 'Edit' : 'Add')} ${isTeacher ? 'Teacher' : 'Student'}
        </h2>
        <button class="btn btn-close-modal" id="close-modal">
          <span>X</span>
        </button>
      </div>
      <div id="person-form" class="flex-column form-modal">
        <div class="flex-column">
          <label class="form-text">Name</label>
          <input
            id="name"
            class="form-input"
            type="text"
            value="${name}"
          />
          <p id="name-error" class="error-message-form"></p>
        </div>
        ${
          isTeacher
            ? `<div class="flex-column">
                <label class="form-text">Subject</label>
                <input
                  id="subject"
                  class="form-input"
                  type="text"
                  value="${subject}"
                />
                <p id="subject-error" class="error-message-form"></p>
              </div>`
            : ''
        }
        <div class="flex-column">
          <label class="form-text">Email address</label>
          <input
            id="email"
            class="form-input"
            type="email"
            value="${email}"
          />
          <p id="email-error" class="error-message-form"></p>
        </div>
        <div class="flex-column">
          <label class="form-text">Avatar url</label>
          <input
            id="avatar"
            class="form-input"
            type="text"
            value="${avatarUrl}"
          />
          <p id="avatarUrl-error" class="error-message-form"></p>
        </div>
        <div class="form-group">
          <div class="form-select flex-column">
            <select id="class" name="class" class="form-input-select">
              <option value="">Class</option>
              ${classOptions}
            </select>
            <p id="className-error" class="error-message-form"></p>
          </div>
          <div class="form-select flex-column">
            <select id="gender" name="gender" class="form-input-select">
              <option value="">Gender</option>
              <option value="Female" ${
                gender === 'Female' ? 'selected' : ''
              }>Female</option>
              <option value="Male" ${
                gender === 'Male' ? 'selected' : ''
              }>Male</option>
            </select>
            <p id="gender-error" class="error-message-form"></p>
          </div>
        </div>
        <div class="flex justify-end btn-modal-group">
          <button class="btn btn-submit" id="btn-submit">
            ${id ? 'Save' : 'Add'} ${isTeacher ? 'Teacher' : 'Student'}
          </button>
          <button id="btn-cancel-modal" class="btn btn-cancel-modal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
};

/**
 * Function to generate a modal confirmation dialog as a string
 * @returns {string} The HTML string for the modal confirmation dialog
 */
export const generateModalConfirm = (): string => `
  <div class="modal-confirm-content">
    <button class="btn btn-close" id="close-modal-confirm">x</button>
    <p class="heading-confirm">
      Are you sure you want to delete this item from the list?
    </p>
    <div class="flex justify-end">
      <button id="cancel-delete" class="btn-confirm">Cancel</button>
      <button id="confirm-delete" class="btn-confirm">Delete</button>
    </div>
  </div>
`;

/**
 * Creates a toast container element with specified message, icon, and success status.
 * @param message - The message to display in the toast.
 * @param icon - The icon filename for the toast.
 * @param isSuccess - Flag indicating whether the toast represents a success (default: false).
 */
const createToastContainer = (
  message: string,
  icon: string,
  isSuccess: boolean,
): HTMLDivElement => {
  const toastContainer = document.createElement('div');

  // Determine the class for the toast text based on whether it's a success message or an error message
  const toastTextClass = isSuccess ? 'toast-text-success' : 'toast-text-error';

  // Set the inner HTML of the toast container with the message and icon
  toastContainer.innerHTML = `
      <div class="toast items-center">
        <img width="30px" height="30px" src="../images/svg/${icon}" alt="${icon}">
        <p class="toast-text ${toastTextClass}">${message}</p>
      </div>
  `;

  return toastContainer;
};

// Displays a toast notification with the specified message, icon, and success status.
export const showToast = (
  message: string,
  icon: string,
  isSuccess = false,
): void => {
  const toastContainer = createToastContainer(message, icon, isSuccess);
  document.body.appendChild(toastContainer);

  // Display the toast container
  toastContainer.style.display = DISPLAY_CLASSES.FLEX;

  // Set a timeout to remove the toast container after 2000 milliseconds (2 seconds)
  setTimeout(() => {
    toastContainer.style.display = DISPLAY_CLASSES.FLEX;
    document.body.removeChild(toastContainer);
  }, TIMES.SHOW_TOAST);
};

/**
 * Represents the container element for displaying the loading spinner.
 */
const loadingContainer = document.getElementById(
  'loading-container',
) as HTMLElement;

// Define the loading spinner object with start and stop methods
const loadingSpinner = {
  // Method to start the loading spinner
  start: function (): void {
    // Set the display style to flex to show the loading spinner
    loadingContainer.style.display = DISPLAY_CLASSES.FLEX;
  },

  // Method to stop the loading spinner
  stop: function (): void {
    // Set the display style to hidden to hide the loading spinner
    loadingContainer.style.display = DISPLAY_CLASSES.HIDDEN;
  },
};

// Function to start the loading spinner
export const startLoadingSpinner = (): void => {
  loadingSpinner.start();
};

// Function to stop the loading spinner
export const stopLoadingSpinner = (): void => {
  loadingSpinner.stop();
};

// Function to delay an action with a loading spinner
export const delayAction = (
  callback: () => void,
  delayTime: number = 50,
): void => {
  // Start the loading spinner
  startLoadingSpinner();

  // Set a timeout to execute the callback after the specified delay time
  setTimeout(() => {
    callback();
  }, delayTime);
};

// Function show UI when data is empty
export const showTabletNoData = (person: string): void => {
  const showNoData = document.querySelectorAll(
    '.dashboard-content',
  ) as NodeListOf<HTMLElement>;

  showNoData.forEach(
    (container: HTMLElement) =>
      (container.innerHTML = `
    <div class="flex-column justify-center items-center tablet-no-data">
      <h3>No ${person} at this time</h3>
      <p>${person} will appear here after they enroll in school.</p>
    </div>
  `),
  );
};

/**
 * @param func - The function to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns A debounced function
 */
export const debounce = (func: () => void, delay: number) => {
  // Initialize timeoutId to hold the ID of the timeout
  let timeoutId: NodeJS.Timeout;

  // Return a debounced function
  return () => {
    clearTimeout(timeoutId);

    // Set a new timeout to execute the function after delay milliseconds.
    timeoutId = setTimeout(func, delay);
  };
};

/**
 * The select input includes the classListOption as its options.
 * @returns {string} - A string representing the HTML for the select filter.
 */
export const generateSelectFilterClass = (): string => `
  <div class="form-select flex-column select-filter">
    <select
      id="select-filter"
      name="select-filter"
      class="form-input-select form-select-filter"
    >
      <option value="">Add filter</option>
      ${classListOption}
    </select>
    <img
      loading="lazy"
      width="12px"
      height="8px"
      class="arrow-icon"
      src="/images/svg/arrow.svg"
      alt="Arrow icon"
    />
  </div>
`;

// This constant maps over CLASS_LIST to create a string of option elements for a select input.
const classListOption: string = CLASS_LIST.map(
  (classOption: string) =>
    `<option value="${classOption}">${classOption}</option>`,
).join('');
