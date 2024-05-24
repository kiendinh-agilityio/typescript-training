import { delayAction, showToast, stopLoadingSpinner, debounce } from '@/utils';
import { MESSAGES, ICONS, DEBOUNCE_TIME, SPECIAL_KEYS, REGEX } from '@/constants';

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
  private handleSearchDebounced: () => void;

  constructor(model: AdsModel, view: AdsView) {
    this.model = model;
    this.view = view;
    this.initialize();

    // Bind add handler to the view
    this.view.bindAddAds(this.handleAddAds.bind(this));

    // Add event listeners for search and clear search buttons
    this.view.searchButton.addEventListener('click', this.handleSearch.bind(this));
    this.view.btnClearSearch.addEventListener('click', this.handleClearSearch.bind(this));

    // Initialize debounced search handling
    this.handleSearchDebounced = debounce(this.handleSearch.bind(this), DEBOUNCE_TIME);

    // Add event listeners for real-time search
    this.view.searchInput.addEventListener('input', () => {
      this.handleSearchDebounced();
    });

    // Add event listener for pressing Enter key in the search input
    this.view.searchInput.addEventListener('keypress', (event) => {
      if (event.key === SPECIAL_KEYS.ENTER) {
        this.handleSearch();
      }
    });
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

  /**
   * Handles the search action.
   */
  async handleSearch(): Promise<void> {
    const keyword: string = this.view.searchInput.value.trim().toLowerCase();

    // Check if a keyword is present and if ad data needs to be loaded
    if (keyword && (!this.model.adsData.length || this.model.error)) {
      await this.model.fetchAdsData();
    }

    // Remove spaces in the keyword
    const formattedKeyword: string = keyword.replace(REGEX.KEYWORD, '');

    // Filter the adsData based on the entered keyword in the search input.
    const filteredAds = this.model.adsData.filter((adsItem) => {
      const { network = '', link = '', email = '', phone = '' } = adsItem || {};

      // Remove spaces and convert to lowercase
      const formattedNetwork: string = network.replace(REGEX.KEYWORD, '').toLowerCase();

      return (
        formattedNetwork.includes(formattedKeyword) ||
        email.includes(formattedKeyword) ||
        phone.includes(formattedKeyword) ||
        link.includes(formattedKeyword)
      );
    });

    // Display matching ads if results are found
    if (filteredAds.length) {
      this.view.displayAdsList(filteredAds);
    } else {
      this.view.handleSearchNoResult();
    }
  }

  /**
   * Handles clearing the search input and displaying the initial data.
   */
  handleClearSearch(): void {
    this.initialize();
  }
}
