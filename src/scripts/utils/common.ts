// Import the constant
import { SELECT_OPTIONS, DISPLAY_CLASSES, TIMES, MESSAGES } from '@/constants';

// Import the Teacher interface
import { Person, Errors, Teacher, isItemTeacher, PersonType } from '@/types';

// Import function utils
import {
  validateEmailField,
  validateAvatarField,
  validateNameField,
  validateSubjectField,
  validateClassField,
  validateGenderField,
} from '@/utils';

/**
 * Create HTML markup for a modal form to manage people (teachers or students).
 * @param item - Object containing person data (optional).
 * @param title - Optional title for the modal (default: 'Add' if no ID is provided, otherwise 'Edit').
 * @param isTeacher - Boolean indicating whether the modal is for a teacher (default: true).
 * @returns HTML string for the modal form.
 */
export const generateModalPerson = (
  item: Person | Teacher,
  title?: string,
  isTeacher: boolean = true,
): string => {
  // Destructure properties from the item object with default values
  const {
    id = '',
    name = '',
    email = '',
    avatarUrl = '',
    className = '',
    gender = '',
  } = item || {};

  // Generate class options
  const classOptions = SELECT_OPTIONS.CLASS_LIST.map(
    (cls) => `
    <option value="${cls}" ${
      className === cls ? 'selected' : ''
    }>${cls}</option>
  `,
  ).join('');

  // Generate subject options
  const subjectOptions = SELECT_OPTIONS.SUBJECT_LIST.map(
    (subjectOption) => `
        <option value="${subjectOption}" ${
          isItemTeacher(item) && item.subject === subjectOption
            ? 'selected'
            : ''
        }>${subjectOption}</option>
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
          <img
            loading="lazy"
            width="30px"
            height="30px"
            src="/images/svg/close.svg"
            alt="Close icon"
          />
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
            id="avatarUrl"
            class="form-input"
            type="text"
            value="${avatarUrl}"
          />
          <p id="avatarUrl-error" class="error-message-form"></p>
        </div>
        ${
          (isTeacher &&
            `
            <div class="flex-column form-select">
              <label class="form-text">Subject</label>
              <select id="subject" name="subject" class="form-input-select">
                <option value="">Subject</option>
                ${subjectOptions}
              </select>
              <img
                  loading="lazy"
                  width="12px"
                  height="8px"
                  class="form-select-icon subject-select-icon"
                  src="/images/svg/arrow.svg"
                  alt="Arrow icon"
              />
              <p id="subject-error" class="error-message-form"></p>
            </div>`) ||
          ''
        }
        <div class="form-group">
          <div class="form-select flex-column">
            <select id="className" name="class" class="form-input-select">
              <option value="">Class</option>
              ${classOptions}
            </select>
            <img
                loading="lazy"
                width="12px"
                height="8px"
                class="form-select-icon"
                src="/images/svg/arrow.svg"
                alt="Arrow icon"
            />
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
            <img
                loading="lazy"
                width="12px"
                height="8px"
                class="form-select-icon"
                src="/images/svg/arrow.svg"
                alt="Arrow icon"
            />
            <p id="gender-error" class="error-message-form"></p>
          </div>
        </div>
        <div class="flex btn-modal-group">
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
 * Function to create a modal confirmation dialog as a string
 * @returns {string} The HTML string for the modal confirmation dialog
 */
export const generateModalConfirm = (): string => `
  <div class="modal-confirm-content">
    <button class="btn btn-close" id="close-modal-confirm">
      <img
        loading="lazy"
        width="24px"
        height="24px"
        src="/images/svg/close.svg"
        alt="Close icon"
      />
    </button>
    <p class="heading-confirm">
      Are you sure you want to delete this item from the list?
    </p>
    <div class="flex justify-center">
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
export const displayToastMessage = (
  message: string,
  icon: string,
  isSuccess = true,
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
export const createDelayAction = (
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
export const displayTabletNoData = (person: string): void => {
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
export const createSearchDebounce = (func: () => void, delay: number) => {
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
export const createFilterClass = (): string => `
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
const classListOption: string = SELECT_OPTIONS.CLASS_LIST.map(
  (classOption: string) =>
    `<option value="${classOption}">${classOption}</option>`,
).join('');

// Create function common show message no results when filter class
export const displayFilterNoResult = (person: PersonType): string =>
  `<p class="filter-no-results">${MESSAGES.NO_RESULT_FILTER(person)}</p>`;

/**
 * Updates error messages on the form.
 * Iterates over the provided errors object and updates the innerText of each corresponding error element.
 * @param {Errors} errors - An object where keys are field names and values are error messages.
 */
const updateErrorMessages = (errors: Errors): void => {
  Object.entries(errors).forEach(([key, value]) => {
    const errorTarget = document.getElementById(`${key}-error`);
    const inputTarget = document.getElementById(key);

    // If errorTarget exists, set its innerText to `value` or an empty string if `value` is falsy.
    if (errorTarget) {
      errorTarget.innerText = value || '';

      // Add or remove error-border class based on whether there's an error message
      inputTarget?.classList.toggle('error-border', !!value);
    }
  });
};

/**
 * Create shows form errors by updating error messages.
 * @param {Errors} errors - An object where keys are field names and values are error messages.
 */
export const displayFormErrors = (errors: Errors): void =>
  updateErrorMessages(errors);

/**
 * Attach blur and input event handlers to form input fields for validation.
 * It adds 'blur' and 'input' event listeners to these input fields to handle form validation and error message updates.
 */
export const attachBlurEventHandlers = (): void => {
  // Define the input fields to be validated along with their corresponding validation functions
  const inputFields = [
    { id: 'name', validate: validateNameField },
    { id: 'email', validate: validateEmailField },
    { id: 'avatarUrl', validate: validateAvatarField },
    { id: 'subject', validate: validateSubjectField },
    { id: 'className', validate: validateClassField },
    { id: 'gender', validate: validateGenderField },
  ];

  // Iterate over each input field and attach the appropriate event listeners
  inputFields.forEach(({ id, validate }) => {
    const input = document.getElementById(id) as HTMLInputElement;
    const errorElement = document.getElementById(`${id}-error`);

    // Update the error message for the input field based on its current value
    const updateErrorText = () => {
      const errorMessage = validate(input.value);
      errorElement.innerText = errorMessage || '';

      // Add or remove the red border based on the validation result
      input.classList.toggle('error-border', !!errorMessage);
    };

    // Attach a blur event listener to the input field
    input?.addEventListener('blur', updateErrorText);

    // Attach an input event listener to the input field
    input?.addEventListener('input', () => {
      !validate(input.value) &&
        ((errorElement.innerText = ''), input.classList.remove('error-border'));
    });
  });
};
