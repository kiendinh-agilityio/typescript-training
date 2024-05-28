// Import the IMAGE_BASE_PATH constant
import { IMAGE_BASE_PATH } from '@/constants';

// Function to handle toggling password visibility
export const handleTogglePassword = (togglePasswordButton: HTMLElement) => {
  const inputField = togglePasswordButton.parentElement!.querySelector('.show-password') as HTMLInputElement;
  const eyeImage = togglePasswordButton.querySelector('img') as HTMLImageElement;
  const isShow = inputField.getAttribute('data-show-password') === 'show';

  // Determine the source of the eye image based on whether the password is shown or hidden
  const eyeImageSrc = isShow ? IMAGE_BASE_PATH.EYE_KEY_PASSWORD : IMAGE_BASE_PATH.EYE_PASSWORD;
  eyeImage.src = eyeImageSrc;

  // Toggle the input field type between 'password' and 'text'
  inputField.type = isShow ? 'password' : 'text';
  inputField.setAttribute('data-show-password', isShow ? 'hidden' : 'show');
};
