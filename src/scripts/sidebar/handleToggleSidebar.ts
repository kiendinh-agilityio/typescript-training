// Import constants
import { DISPLAY_CLASS } from '@/constants';

/**
 * Function to handle toggling the sidebar open and closed
 */
export const handleToggleSidebar = (): void => {
  // Get the sidebar, open button, and close button elements from the DOM
  const sidebar: HTMLElement | null = document.getElementById('sidebar');
  const openBtn: HTMLElement | null = document.getElementById('open-btn');
  const closeBtn: HTMLElement | null = document.getElementById('close-btn');

   // Function to toggle the visibility of the sidebar and buttons
  const toggleSidebar = (): void => {
    sidebar.classList.toggle(DISPLAY_CLASS.FLEX);
    openBtn.classList.toggle(DISPLAY_CLASS.HIDDEN);
    closeBtn.classList.toggle(DISPLAY_CLASS.HIDDEN);
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
