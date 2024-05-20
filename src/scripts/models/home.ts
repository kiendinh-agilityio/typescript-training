// Import http services
import { httpServices } from '@/services';

// Define the structure of advertisement data
import { AdsData } from '@/interfaces';

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
}
