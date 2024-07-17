// Import sidebar initialization function from '@/sidebar'
import { initializeSidebar } from '@/sidebar';

// Import event loader function for teachers from '@/pages'
import { eventLoaderTeacher } from '@/pages';

// Define function to initialize the application
const initialApp: () => void = () => {
  // Call the event loader function for teachers
  eventLoaderTeacher();
};

// Initialize the sidebar
initializeSidebar();

// Call initialApp function to start the application
initialApp();
