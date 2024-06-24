// Constants
import {
  DISPLAY_CLASS,
  TITLE_AUTH_PAGE,
  ICONS,
  SIGNUP_MESSAGES,
} from '@/constants';

// Utility functions
import {
  handleTogglePassword,
  showToast,
  authSection,
  validateUserAuthen,
  showFormErrors,
} from '@/utils';

// Define interface for controller
interface AuthControllerInterface {
  login(email: string, password: string): Promise<void>;
  register(
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<void>;
}

/**
 * Represents the view for authentication.
 */
export class AuthView {
  controller: AuthControllerInterface;

  // Define class properties
  formTitle: HTMLElement;
  confirmPasswordGroup: HTMLElement;
  actionSigninButton: HTMLButtonElement;
  actionSignupButton: HTMLButtonElement;
  btnSignIn: HTMLButtonElement;
  btnSignUp: HTMLButtonElement;
  togglePasswordButtons: NodeListOf<HTMLElement>;

  formAuth: HTMLElement;
  emailInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  emailError: HTMLElement;
  passwordError: HTMLElement;
  confirmPasswordInput: HTMLInputElement;
  confirmPasswordError: HTMLElement;

  /**
   * Create an AuthView instance.
   * @param {AuthController} controller - The controller for handling authentication actions.
   */
  constructor(controller: AuthControllerInterface) {
    this.controller = controller;
    this.initElements();
    this.initEventListeners();
  }

  /** Initialize DOM elements used in the view. */
  initElements(): void {
    this.formTitle = authSection.querySelector('#heading-auth');
    this.confirmPasswordGroup = authSection.querySelector(
      '#confirm-password-group',
    );
    this.actionSigninButton = authSection.querySelector('#btn-action-signin');
    this.actionSignupButton = authSection.querySelector('#btn-action-signup');
    this.btnSignIn = authSection.querySelector('#btn-signin');
    this.btnSignUp = authSection.querySelector('#btn-signup');
    this.togglePasswordButtons =
      authSection.querySelectorAll('.toggle-password');

    this.formAuth = document.getElementById('form-auth');
    this.emailInput = this.formAuth.querySelector('#email');
    this.passwordInput = this.formAuth.querySelector('#password');
    this.emailError = this.formAuth.querySelector('#email-error');
    this.passwordError = this.formAuth.querySelector('#password-error');
    this.confirmPasswordInput =
      this.formAuth.querySelector('#confirm-password');
    this.confirmPasswordError = this.formAuth.querySelector(
      '#confirmPassword-error',
    );
  }

  /** Initialize event listeners for the view. */
  initEventListeners(): void {
    // Set form title to 'Sign In' when Sign In button is clicked
    this.actionSigninButton.addEventListener('click', () =>
      this.updateFormTitle(TITLE_AUTH_PAGE.LOGIN),
    );

    // Set form title to 'Create New Account' when Create New Account button is clicked
    this.actionSignupButton.addEventListener('click', () =>
      this.updateFormTitle(TITLE_AUTH_PAGE.REGISTER),
    );

    // Add event listeners to toggle password visibility
    this.togglePasswordButtons.forEach((togglePasswordButton) => {
      togglePasswordButton.addEventListener('click', () =>
        handleTogglePassword(togglePasswordButton),
      );
    });

    // Trigger handleSignInClick method when Sign In button is clicked
    this.btnSignIn.addEventListener('click', () => this.handleSignInClick());

    // Trigger handleLoginFormSubmit method when the form is submitted
    this.formAuth.addEventListener(
      'submit',
      this.handleLoginFormSubmit.bind(this),
    );
  }

  /** Clear error messages for email, password, and confirmPassword fields. */
  clearError(): void {
    this.emailError.textContent = '';
    this.passwordError.textContent = '';
    this.confirmPasswordError.textContent = '';
  }

  /**
   * Update the form title and clear errors when switching between Sign In and Sign Up forms.
   * @param {string} title - The title to set for the form.
   */
  updateFormTitle(title: string): void {
    this.formTitle.textContent = title;

    // Clear errors when switching between forms
    this.clearError();

    // Show appropriate buttons based on form title
    this.btnSignIn.style.display =
      title === TITLE_AUTH_PAGE.LOGIN
        ? DISPLAY_CLASS.BLOCK
        : DISPLAY_CLASS.HIDDEN;
    this.btnSignUp.style.display =
      title === TITLE_AUTH_PAGE.REGISTER
        ? DISPLAY_CLASS.BLOCK
        : DISPLAY_CLASS.HIDDEN;
    this.actionSigninButton.classList.toggle(
      DISPLAY_CLASS.ACTIVE,
      title === TITLE_AUTH_PAGE.LOGIN,
    );
    this.actionSignupButton.classList.toggle(
      DISPLAY_CLASS.ACTIVE,
      title === TITLE_AUTH_PAGE.REGISTER,
    );
    this.confirmPasswordGroup.classList.toggle(
      DISPLAY_CLASS.FLEX,
      title === TITLE_AUTH_PAGE.REGISTER,
    );
  }

  /** Handle Sign In button click. */
  handleSignInClick(): void {
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    const isBothFieldsEmpty = email.trim() === '' && password.trim() === '';

    // If both fields are not empty, proceed with the login
    !isBothFieldsEmpty && this.controller.login(email, password);
  }

  /**
   * Handle form submission.
   * @param {Event} event - The form submission event.
   */
  async handleLoginFormSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    this.clearError();

    const user = {
      email,
      password,
      confirmPassword,
    };
    const errors = validateUserAuthen(user);

    if (Object.keys(errors).length) {
      showFormErrors(errors);
    } else {
      try {
        const action =
          this.formTitle.textContent === TITLE_AUTH_PAGE.REGISTER
            ? this.controller.register(email, password, confirmPassword)
            : this.controller.login(email, password);

        await action;
      } catch (error) {
        const toastError =
          error.response?.data?.message || SIGNUP_MESSAGES.FAILURE;
        this.showErrorToast(toastError);
      }
    }
  }

  /**
   * Show success toast message.
   * @param {string} message - The success message to display.
   */
  showSuccessToast(message: string): void {
    showToast(message, ICONS.SUCCESS, true);
  }

  /**
   * Show error toast message.
   * @param {string} message - The error message to display.
   */
  showErrorToast(message: string): void {
    showToast(message, ICONS.ERROR, false);
  }
}
