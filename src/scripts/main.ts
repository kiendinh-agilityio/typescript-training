// Import sidebar initialization function from '@/sidebar'
import { initializeSidebar } from '@/sidebar';

// Import event loader function for teachers from '@/pages'
import { TeacherPage } from '@/pages';

// Import PersonServices class from '@/services'
import { PersonServices } from '@/services';

// Import TeacherList class from '@/events'
import { TeacherList } from '@/events';

// Define function to initialize the application
const initialApp = () => {
  new TeacherPage(new PersonServices(), new TeacherList());
};

// Initialize the sidebar
initializeSidebar();

// Call initialApp function to start the application
initialApp();
