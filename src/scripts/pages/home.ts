// Initialize the sidebar
import { initializeSidebar } from '@/sidebar';

// Import the Ads controller
import { AdsController } from '@/controllers';

// Import the Ads view
import { AdsView } from '@/views';

// Import the Ads model
import { AdsModel } from '@/models';

// Function to set up the home page
const homePage = () => {
  new AdsController(new AdsModel(), new AdsView());
};

// Initialize the home page
homePage();

// Initialize the sidebar
initializeSidebar();
