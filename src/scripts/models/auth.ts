import {
  BASE_API,
  LOGIN_MESSAGES,
  END_POINTS,
} from '@/constants';

/** Class representing the authentication model. */
export class AuthModel {
  /**
   * Attempt to log in a user.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<void>} - A Promise that resolves if the login is successful.
   * @throws {Error} - Throws an error if login is unsuccessful or if there's an API error.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      // Fetch the user data from the API
      const response = await fetch(`${BASE_API}${END_POINTS.USERS}`);
      if (response.ok) {
        const users = await response.json();
        const user = users.find((user: any) => user.email === email);

        if (user && user.password === password) {
          // Successful login
          return Promise.resolve();
        } else {
          // Login unsuccessful
          throw new Error(LOGIN_MESSAGES.UNSUCCESSFUL);
        }
      } else {
        // Error when fetching user data
        throw new Error('Error fetching user data');
      }
    } catch (error) {
      // Handle API connection error and show error toast
      throw error;
    }
  }
}
