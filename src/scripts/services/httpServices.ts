// Import constants
import { BASE_API, API_METHODS, MESSAGES } from '@/constants';

// Import type and interfaces
import { Person } from '@/types';

/**
 * A reusable function for making HTTP requests.
 * @param {string} url - The URL for the API endpoint.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
 * @param {object} data - The data to be sent in the request body (optional).
 * @returns {Promise} A promise that resolves to the JSON response data or an error.
 */
const sendRequest = async <T>(
  url: string,
  method: string,
  data?: Person,
): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : null,
  });

  // Check if the response status is not okay (e.g., non-2xx status code)
  if (!response.ok) {
    throw new Error(MESSAGES.REQUEST_FAILED);
  }

  // Parse and return the JSON response data
  return (await response.json()) as T;
};

export const httpServices = (endpoint: string) => {
  return {
    /**
     * Fetch a list of person from the API.
     * @returns {Promise} A promise that resolves to the list of person.
     */
    async get(queryString = ''): Promise<Person[]> {
      const url = `${BASE_API}${endpoint}${queryString}`;

      return sendRequest<Person[]>(url, API_METHODS.GET).catch((error) => {
        throw error;
      });
    },

    /**
     * Add a new person to the API.
     * @param {object} data - The data of the person to be added.
     * @returns {Promise} A promise that resolves to the newly added person.
     */
    async post(data: Person): Promise<Person> {
      const url = `${BASE_API}${endpoint}`;

      return sendRequest<Person>(url, API_METHODS.POST, data).catch((error) => {
        throw error;
      });
    },

    /**
     * Update the information of an person using the PUT method.
     * @param {number} id - The ID of the person to be updated.
     * @param {object} data - The updated data for the person.
     * @returns {Promise} A promise that resolves to the updated person data.
     */
    async put(id: string, data: Person): Promise<Person[]> {
      const url = `${BASE_API}${endpoint}/${id}`;

      return sendRequest<Person[]>(url, API_METHODS.PUT, data).catch(
        (error) => {
          throw error;
        },
      );
    },

    /**
     * Delete an person by its ID using the DELETE method.
     * @param {number} id - The ID of the person to be deleted.
     * @returns {Promise} A promise that resolves to the deleted person.
     */
    async delete(id: string): Promise<Person[]> {
      const url = `${BASE_API}${endpoint}/${id}`;

      return sendRequest<Person[]>(url, API_METHODS.DELETE).catch((error) => {
        throw error;
      });
    },

    /**
     * Get the information of an person using the GET method.
     * @param {number} id - The ID of the person to be updated.
     * @returns {Promise} A promise that resolves to the updated person data.
     */
    async getDetail(id: string): Promise<Person> {
      const url = `${BASE_API}${endpoint}/${id}`;

      return sendRequest<Person>(url, API_METHODS.GET).catch((error) => {
        throw error;
      });
    },
  };
};
