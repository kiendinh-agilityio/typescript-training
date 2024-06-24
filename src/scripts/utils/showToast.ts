// Import the DISPLAY_CLASS constant
import { DISPLAY_CLASS } from '@/constants';

// Function to create toast container
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

// Function to display toast
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
