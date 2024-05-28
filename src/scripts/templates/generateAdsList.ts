// Import the AdsData interface
import { AdsData } from '@/interfaces';

// Import the adsItem function
import { adsItem } from './adsItem';

// Function to generate the HTML for a list of ads
export const generateListAds = (items: AdsData[]): string => `
  <div class="table-container">
    <!-- Table header with column titles -->
    <ul class="flex flex-wrap justify-between table-row thead">
      <li data-column="network" data-index="0">Network</li>
      <li data-column="status" data-index="1">Status</li>
      <li>Email</li>
      <li>Phone</li>
      <li></li>
    </ul>
    <!-- Table body with ads items -->
    <div class="flex-column flex-wrap tbody relative">
      <!-- Generate HTML for each ad item and join them into a single string -->
      ${items.map(adsItem).join('')}
    </div>
  </div>
`;
