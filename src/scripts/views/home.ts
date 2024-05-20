// Import ads List
import { generateListAds } from '@/templates';

// Import interfaces Ads Data
import { AdsData } from '@/interfaces';

// AdsView class definition
export class AdsView {
  tableElement: HTMLElement;

  constructor() {
    this.initElementsAds();
  }

  /**
   * Initializes the DOM elements used by AdsView.
   */
  initElementsAds(): void {
    this.tableElement = document.getElementById('list-ads')!;
  }

  /**
   * Displays the list of ads in the table.
   * @param {Array} adsData - The list of ads to be displayed.
   */
  displayAdsList(adsData: AdsData[]): void {
    const adsListHTML = generateListAds(adsData);
    this.tableElement.innerHTML = adsListHTML;
  }
}
