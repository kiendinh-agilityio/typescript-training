// Import the constant
import { DISPLAY_CLASS } from '@/constants';

// Import the AdsData interface
import { AdsData } from '@/interfaces';

/**
 * Generates HTML markup for a modal form to manage advertisements.
 * @param item - Object containing advertisement data (optional).
 * @param title - Optional title for the modal (default: 'Add Ads' if no ID is provided, otherwise 'Edit Ads').
 * @returns HTML string for the modal form.
 */
export const generateModalAds = (item: AdsData, title?: string): string => {
  // Destructure properties from the item object with default values
  const {
    id = '',
    network = '',
    link = '',
    email = '',
    phone = '',
    status = '',
  } = item || {};

  // Return the HTML string for the modal form
  return `
    <div class="modal-content">
      <div class="modal-header flex-row justify-between items-center">
        <h2 class="modal-heading">${title || (id ? 'Edit Ads ' : 'Add Ads')}</h2>
        <button class="btn btn-close-modal" id="close-modal-ads">
          <span>X</span>
        </button>
      </div>
      <div id="ads-form" class="flex-column form-modal">
        <div class="flex-column">
          <input
            id="network"
            class="form-input"
            type="text"
            placeholder="Network"
            value="${network}"
          />
          <div id="network-error" class="error-message-form"></div>
        </div>
        <div class="flex-column">
          <input
            id="link"
            class="form-input"
            type="text"
            placeholder="www.example.com"
            value="${link}"
          />
          <div id="link-error" class="error-message-form"></div>
        </div>
        <div class="flex-column">
          <input
            id="email"
            class="form-input"
            type="email"
            placeholder="Email"
            value="${email}"
          />
          <div id="email-error" class="error-message-form"></div>
        </div>
        <div class="flex justify-between form-group">
          <div class="phone-number-input flex-column">
            <input
              id="phone"
              class="form-input"
              placeholder="Mobile No"
              type="text"
              value="${phone}"
            />
            <div id="phone-error" class="error-message-form"></div>
          </div>
          <div class="form-select flex-column">
            <select id="status-type" name="status-type" class="form-input-select">
              <option value="">Select Status</option>
              <option value="Paused" ${status === 'Paused' ? 'selected' : ''}>Paused</option>
              <option value="Active" ${status === 'Active' ? 'selected' : ''}>Active</option>
            </select>
            <div id="status-error" class="error-message-form"></div>
          </div>
        </div>
        <div class="flex justify-end btn-modal-group">
          <button class="btn btn-submit" id="add-ads-submit">
            ${id ? 'Save Ads ' : 'Add Ads'}
          </button>
          <button id="add-ads-cancel" class="btn btn-close-modal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
};

/**
 * @param func - The function to debounce.
 * @param delay - The delay in milliseconds before the function is invoked.
 * @returns A debounced version of the original function.
 */
type DebounceArgs = [string, number];

export const debounce = <T extends (...args: DebounceArgs) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  // Return a debounced function
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeoutId);

    // Set a new timeout to call the function after the specified delay
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

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
  toastContainer.style.display = DISPLAY_CLASS.FLEX;

  // Set a timeout to remove the toast container after 2000 milliseconds (2 seconds)
  setTimeout(() => {
    toastContainer.style.display = DISPLAY_CLASS.FLEX;
    document.body.removeChild(toastContainer);
  }, 2000);
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
    loadingContainer.style.display = DISPLAY_CLASS.FLEX;
  },

  // Method to stop the loading spinner
  stop: function (): void {
    // Set the display style to hidden to hide the loading spinner
    loadingContainer.style.display = DISPLAY_CLASS.HIDDEN;
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
