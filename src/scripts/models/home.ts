// Import http services
import { httpServices } from '@/services';

// Define the structure of advertisement data
import { AdsData } from '@/interfaces';

import { MESSAGES, ROLE_STATUS } from '@/constants';

export class AdsModel {
  adsData: AdsData[];
  error: Error | null;

  constructor() {
    this.adsData = [];
    this.error = null;
  }

  /**
   * A method to fetch data from the server with an optional query parameter.
   * @param {string} query - The query parameter to be added to the request.
   * @returns {Promise} - A promise that resolves with the response data or rejects with an error.
   */
  async fetchAdsData(): Promise<AdsData[]> {
    try {
      const response = await httpServices().get();

      // Save the response data to the adsData array
      this.adsData = response;

      return response;
    } catch (error) {
      this.error = error;
      throw error;
    }
  }

  // Method to add a new advertisement
  async addAds(adsItem: AdsData): Promise<void> {
    try {
      // Check the condition for statusID and update adsItem
      const newAds: AdsData = {
        ...adsItem,
        statusID: adsItem.status.includes('Active') ? ROLE_STATUS.ACTIVE : ROLE_STATUS.PAUSED,
      };
      const response = await httpServices().post(newAds);
      return response;
    } catch (error) {
      console.error(MESSAGES.ADD_ERROR);
      throw error;
    }
  }
}
