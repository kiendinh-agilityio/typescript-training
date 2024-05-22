import { delayAction, showToast, stopLoadingSpinner } from '@/utils';
import { MESSAGES, ICONS } from '@/constants';

import { AdsModel } from '../models/home';
import { AdsView } from '../views/home';

// Define the structure of advertisement data
import { AdsData } from '@/interfaces';

/**
 * Represents the AdsController class for handling the business logic and user interactions.
 */
export class AdsController {
  model: AdsModel;
  view: AdsView;

  constructor(model: AdsModel, view: AdsView) {
    this.model = model;
    this.view = view;
    this.initialize();

    // Bind add handler to the view
    this.view.bindAddAds(this.handleAddAds.bind(this));
  }

  /**
   * Initializes the AdsController and fetches the initial data.
   */
  async initialize(): Promise<void> {
    const data = await this.model.fetchAdsData();

    if (data) {
      this.view.displayAdsList(data);
    }
  }

  /**
   * Handles the asynchronous addition of new ads.
   * @param {object} newAds - The data of the new ad to be added.
   */
  async handleAddAds(newAds: AdsData): Promise<void> {
    // Introduce a delay before adding the new ad
    delayAction(async () => {
      // Send a request to add the new ad and await the response
      const response = await this.model.addAds(newAds);

      // Update this.model.adsData with the new data from the response
      this.model.adsData.push(response);

      // Refresh adsData after adding
      await this.model.fetchAdsData();

      // Display the list of ads after adding
      this.view.displayAdsList(this.model.adsData);

      // Return to the initial state
      await this.initialize();

      // Directly stop loading spinner after response is received
      stopLoadingSpinner();

      // Show success toast message
      showToast(MESSAGES.ADD_SUCCESS, ICONS.SUCCESS, true);
    });
  }

  // Show the ads modal with the given adsData
  handleShowAdsModal(adsData: any): void {
    this.view.showAdsModal(adsData);
  }
}
