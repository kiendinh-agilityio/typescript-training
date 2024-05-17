// Constants
import {
  BASE_API,
  LOGIN_MESSAGES,
  END_POINTS,
  ERROR_FETCHING_DATA,
  SIGNUP_MESSAGES,
  VALIDATE_MESSAGES,
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
        throw new Error(ERROR_FETCHING_DATA);
      }
    } catch (error) {
      // Handle API connection error and show error toast
      throw error;
    }
  }

  /**
   * Attempt to register a new user.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} confirmPassword - The user's password confirmation.
   * @returns {Promise<void>} - A Promise that resolves if the registration is successful.
   * @throws {Error} - Throws an error if registration is unsuccessful or if there's an API error.
   */
  async register(email: string, password: string, confirmPassword: string): Promise<void> {
    try {
      // Check if email, password, and confirmPassword are empty
      if (!email || !password || !confirmPassword) {
        throw new Error(SIGNUP_MESSAGES.EMPTY);
      }

      // Fetch the user data from the API
      const response = await fetch(`${BASE_API}${END_POINTS.USERS}`);
      if (response.ok) {
        const users = await response.json();

        // Check if email already exists
        const userExists = users.some((user: any) => user.email === email);
        if (userExists) {
          throw new Error(SIGNUP_MESSAGES.EMAIL);
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
          throw new Error(VALIDATE_MESSAGES.INVALID_CONFIRM_PASSWORD);
        }

        // Create a new user object
        const newUser = {
          email,
          password,
        };

        // Save the new user data to the API
        const saveResponse = await fetch(`${BASE_API}${END_POINTS.USERS}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        if (saveResponse.ok) {
          // Registration successful
          return Promise.resolve();
        } else {
          // Error when saving user data
          throw new Error('Error saving user data');
        }
      } else {
        // Error when fetching user data
        throw new Error('Error fetching user data');
      }
    } catch (error) {
      // Handle and display error in the view
      throw error;
    }
  }
}
