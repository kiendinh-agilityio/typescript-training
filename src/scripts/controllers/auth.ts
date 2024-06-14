// Constanst
import { LOGIN_MESSAGES, SIGNUP_MESSAGES } from '@/constants';

// View: Import the AuthView component from the views directory
import { AuthView } from '../views/auth';

// Model: Import the AuthModel from the models directory
import { AuthModel } from '../models/auth';

export class AuthController {
  view: AuthView;
  model: AuthModel;

  /** Create an AuthenController instance. */
  constructor() {
    this.view = new AuthView(this);
    this.model = new AuthModel();
  }

  /**
   * Attempt to log in a user.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      // Attempt login using AuthenModel
      await this.model.login(email, password);
      // Show success message if login is successful
      this.view.showSuccessToast(LOGIN_MESSAGES.SUCCESS);
      // Redirect to the index page
      window.location.href = '/';
    } catch (error) {
      // Show error message if login fails
      this.view.showErrorToast(error.message);
    }
  }

  /**
   * Attempt to register a new user.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} confirmPassword - The user's password confirmation.
   */
  async register(email: string, password: string, confirmPassword: string): Promise<void> {
    // Attempt registration using AuthenModel
    await this.model.register(email, password, confirmPassword);

    // Show success message if registration is successful
    this.view.showSuccessToast(SIGNUP_MESSAGES.SUCCESS);
  }
}
