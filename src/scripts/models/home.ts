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

  // Method to search advertisements by keyword
  async searchAdsByKeyword(keyword: string): Promise<AdsData[]> {
    return this.fetchAdsData(`?search=${keyword}`);
  }

  /**
   * A method to delete an advertisement by ID.
   * @param {number} adsId - The ID of the ad to be deleted.
   * @returns {Promise} - A promise that resolves when the deletion is successful or rejects with an error.
   */
  async deleteAds(adsId: number): Promise<void> {
    try {
      const response = await httpServices().delete(`/${adsId}`);
      return response;
    } catch (error) {
      console.error(MESSAGES.DELETE_ERROR);
      throw error;
    }
  }

  /**
   * Asynchronously retrieves detailed information for a specific advertisement using its unique identifier.
   * @param {string} id - The unique identifier of the advertisement.
   * @returns {Promise<Object>} - A promise that resolves to the detailed information of the advertisement.
   */
  async getAdsDetail(id: number): Promise<AdsData | null> {
    try {
      const response = await httpServices().getDetail(id);
      this.adsDetail = response;
      return response;
    } catch (error) {
      console.error(MESSAGES.GET_DETAIL_ID_ERROR);
      throw error;
    }
  }

  /**
   * A method to edit an existing advertisement by ID.
   * @param {number} adsId - The ID of the ad to be edited.
   * @param {object} updatedAdsItem - The updated data of the ad.
   * @returns {Promise} - A promise that resolves when the editing is successful or rejects with an error.
   */
  async editAds(adsId: number, updatedAdsItem: AdsData): Promise<void> {
    try {
      // Check the condition for statusID and update updatedAdsItem
      updatedAdsItem.statusID = updatedAdsItem.status.includes('Active') ? ROLE_STATUS.ACTIVE : ROLE_STATUS.PAUSED;
      const response = await httpServices().put(`/${adsId}`, updatedAdsItem);
      return response;
    } catch (error) {
      console.error(MESSAGES.EDIT_ERROR);
      throw error;
    }
  }
}
