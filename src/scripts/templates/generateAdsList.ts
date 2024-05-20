// Interfaces for AdItem
import { AdsData } from '@/interfaces';

// Ads Item
import { adsItem } from './adsItem';

export const generateListAds = (items: AdsData[]): string => `
  <div class="table-container">
    <ul class="flex flex-wrap justify-between table-row thead">
      <li data-column="network" data-index="0">Network</li>
      <li data-column="status" data-index="1">Status</li>
      <li>Email</li>
      <li>Phone</li>
      <li></li>
    </ul>
    <div class="flex-column flex-wrap tbody relative">
      ${items.map(adsItem).join('')}
    </div>
  </div>
`;
