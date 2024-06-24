// Import constants
import { DISPLAY_CLASS } from '@/constants';

// Get the loading container element from the DOM
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
