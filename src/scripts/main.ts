// Import constants
import { CURRENT_PATH } from '@/constants';

// Import sidebar initialization function from '@/sidebar'
import { initializeSidebar } from '@/sidebar';

// Import event loader function for teachers and student from '@/pages'
import { TeacherPage, StudentPage } from '@/pages';

// Import TeacherList, StudentList class from '@/events'
import { TeacherList, StudentList } from '@/events';

// Define function to initialize the application
const initialApp = () => {
  const currentPath = window.location.pathname;

  // Initialize TeacherPage or StudentPage based on the current URL
  currentPath.includes(CURRENT_PATH.TEACHER) ||
  currentPath === CURRENT_PATH.HOME
    ? new TeacherPage(new TeacherList())
    : currentPath.includes(CURRENT_PATH.STUDENT) &&
      new StudentPage(new StudentList());
};

// Initialize the sidebar
initializeSidebar();

// Call initialApp function to start the application
initialApp();
