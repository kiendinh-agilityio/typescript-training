// Import constants
import { DISPLAY_CLASSES } from '@/constants';

/**
 * Function to handle toggling the sidebar open and closed
 */
export const handleToggleSidebar = (): void => {
  // Get the sidebar, open button, and close button elements from the DOM
  const sidebar: HTMLElement = document.getElementById('sidebar');
  const openBtn: HTMLElement = document.getElementById('open-btn');
  const closeBtn: HTMLElement = document.getElementById('close-btn');

  // Function to toggle the visibility of the sidebar and buttons
  const toggleSidebar = (): void => {
    sidebar.classList.toggle(DISPLAY_CLASSES.FLEX);
    openBtn.classList.toggle(DISPLAY_CLASSES.HIDDEN);
    closeBtn.classList.toggle(DISPLAY_CLASSES.HIDDEN);
  };

  // Add event listeners to the open and close buttons to toggle the sidebar
  openBtn.addEventListener('click', toggleSidebar);
  closeBtn.addEventListener('click', toggleSidebar);

  // Add event listener to the sidebar to close it when clicking outside the content
  sidebar.addEventListener('click', (event: Event) => {
    if (event.target === sidebar) {
      toggleSidebar();
    }
  });
};
