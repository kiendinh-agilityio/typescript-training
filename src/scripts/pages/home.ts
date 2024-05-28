// Initialize the sidebar
import { initializeSidebar } from '@/sidebar';

// Import the Ads controller
import { AdsController } from '../controllers/home';

// Import the Ads view
import { AdsView } from '../views/home';

 // Import the Ads model
import { AdsModel } from '../models/home';

// Function to set up the home page
const homePage = () => {
  new AdsController(new AdsModel(), new AdsView());
};

// Initialize the home page
homePage();

// Initialize the sidebar
initializeSidebar();
