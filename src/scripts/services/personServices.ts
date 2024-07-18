// Import http services
import { httpServices } from '@/services';

// Define the structure of person data
import { Person } from '@/interfaces';

// Import constants
import { MESSAGES } from '@/constants';

export class PersonServices {
  personData: Person[];
  error?: Error | null;
  personDetail: Person;

  constructor() {
    this.personData = [];
    this.error = null;
  }

  /**
   * A method to fetch data from the server with an optional query parameter.
   * @param {string} query - The query parameter to be added to the request.
   * @returns {Promise} - A promise that resolves with the response data or rejects with an error.
   */
  async fetchPersonData(queryString = ''): Promise<Person[]> {
    try {
      const response = await httpServices().get(queryString);

      // Save the response data to the personData array
      this.personData = response;

      return response;
    } catch (error) {
      this.error = error;
      throw error;
    }
  }

  // Method to add a new person
  async addPerson(personItem: Person): Promise<Person> {
    try {
      const newPerson = personItem;

      const response = await httpServices().post(newPerson);

      return response;
    } catch (error) {
      console.error(MESSAGES.ADD_ERROR);
      throw error;
    }
  }

  // Method to search person by keyword
  async searchPersonByKeyword(keyword: string): Promise<Person[]> {
    return this.fetchPersonData(`?search=${keyword}`);
  }

  /**
   * A method to delete an person by ID.
   * @param {number} personId - The ID of the person to be deleted.
   * @returns {Promise} - A promise that resolves when the deletion is successful or rejects with an error.
   */
  async deletePerson(personId: string): Promise<Person[]> {
    try {
      const response = await httpServices().delete(`/${personId}`);

      return response;
    } catch (error) {
      console.error(MESSAGES.DELETE_ERROR);
      throw error;
    }
  }

  /**
   * Asynchronously retrieves detailed information for a specific person using its unique identifier.
   * @param {string} id - The unique identifier of the person.
   * @returns {Promise<Object>} - A promise that resolves to the detailed information of the person.
   */
  async getPersonDetail(id: string): Promise<Person> {
    try {
      const response = await httpServices().getDetail(id);
      this.personDetail = response;

      return response;
    } catch (error) {
      console.error(MESSAGES.GET_DETAIL_ID_ERROR);
      throw error;
    }
  }

  /**
   * A method to edit an existing advertisement by ID.
   * @param {number} personId - The ID of the ad to be edited.
   * @param {object} updatedPersonItem - The updated data of the person.
   * @returns {Promise} - A promise that resolves when the editing is successful or rejects with an error.
   */
  async editPerson(
    personId: string,
    updatedPersonItem: Person,
  ): Promise<Person[]> {
    try {
      // Update updatedPersonItem
      const response = await httpServices().put(
        `/${personId}`,
        updatedPersonItem,
      );

      return response;
    } catch (error) {
      console.error(MESSAGES.EDIT_ERROR);
      throw error;
    }
  }
}
