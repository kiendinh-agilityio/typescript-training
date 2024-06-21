// Import constants
import {
  MESSAGES,
  ICONS,
  DEBOUNCE_TIME,
  SPECIAL_KEYS,
  REGEX,
} from '@/constants';

// Define the structure of advertisement data
import { AdsData } from '@/interfaces';

// Import utils
import { delayAction, showToast, stopLoadingSpinner, debounce } from '@/utils';

// Import AdsModel and AdsView
import { AdsModel } from '@/models';
import { AdsView } from '@/views';

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
    this.view.searchButton.addEventListener(
      'click',
      this.handleSearch.bind(this),
    );
    this.view.btnClearSearch.addEventListener(
      'click',
      this.handleClearSearch.bind(this),
    );

    // Initialize debounced search handling
    this.handleSearchDebounced = debounce(
      this.handleSearch.bind(this),
      DEBOUNCE_TIME,
    );

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

    // Bind delete handler to the view
    this.view.bindDeleteAds(this.handleDeleteAds.bind(this));

    // Bind edit handler to the view
    this.view.bindEditAds(this.handleEditAds.bind(this));

    // Add event edit
    this.view.bindGetDetailAds(this.handleGetDetailAds.bind(this));

    // Set logout handler for the view
    this.view.setLogoutHandler(this.handleLogout.bind(this));
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

      // Check if the response is an array, then push the items into adsData
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
  handleShowAdsModal(adsData: AdsData): void {
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
      const formattedNetwork: string = network
        .replace(REGEX.KEYWORD, '')
        .toLowerCase();

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

  /**
   * Handles the user deletion.
   * @param {number} adsId - The ID of the ad to be deleted.
   */
  async handleDeleteAds(adsId: string): Promise<void> {
    // Introduce a delay before actually deleting the ad
    delayAction(async () => {
      // Delete the ad from the model
      const response = await this.model.deleteAds(adsId);

      // Filter out the deleted ad from the adsData list
      const updatedAdsData = this.model.adsData.filter(
        (ads) => ads.id !== adsId,
      );

      // Display the updated list of ads
      this.view.displayAdsList(updatedAdsData);

      // Return to the initial state
      await this.initialize();

      if (response) {
        stopLoadingSpinner();
      }

      // Show a success notification
      showToast(MESSAGES.DELETE_SUCCESS, ICONS.SUCCESS, true);
    });
  }

  /**
   * Handles the asynchronous editing of existing ads.
   * @param {number} adsId - The ID of the ad to be edited.
   * @param {object} updatedAdsItem - The updated data of the ad.
   */
  async handleEditAds(adsId: string, updatedAdsItem: AdsData): Promise<void> {
    // Introduce a delay before actually editing the ad
    delayAction(async () => {
      // Edit the ad in the model
      const response = await this.model.editAds(adsId, updatedAdsItem);

      // Find the edited ad in the adsData array
      const editedAd =
        this.model.adsData.find((ads) => ads.id === adsId);

      // Update the edited ad with the response data
      editedAd && Object.assign(editedAd, response);

      // Display the updated list of ads
      this.view.displayAdsList(this.model.adsData);

      // Return to the initial state
      await this.initialize();

      // Directly stop loading spinner after response is received
      stopLoadingSpinner();

      // Show a success notification
      showToast(MESSAGES.EDIT_SUCCESS, ICONS.SUCCESS, true);
    });
  }

  /**
   * Asynchronously handles the retrieval of detailed information for a specific advertisement.
   * @param {string} adsId - The unique identifier of the advertisement.
   */
  async handleGetDetailAds(adsId: string): Promise<void> {
    // Await the retrieval of detailed advertisement information using the provided adsId.
    const response = await this.model.getAdsDetail(adsId);

    // Display the advertisement modal with the retrieved details from the model.
    this.view.showAdsModal(response);
  }

  /**
   * Handles the logout action by redirecting to 'authen.html'.
   */
  handleLogout(): void {
    window.location.href = 'auth';
  }
}
