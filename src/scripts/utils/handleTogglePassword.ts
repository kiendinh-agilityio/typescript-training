// Constants
import { IMAGE_BASE_PATH } from '@/constants';

export const handleTogglePassword = (togglePasswordButton: HTMLElement) => {
  const inputField = togglePasswordButton.parentElement!.querySelector('.show-password') as HTMLInputElement;
  const eyeImage = togglePasswordButton.querySelector('img') as HTMLImageElement;
  const isShow = inputField.getAttribute('data-show-password') === 'show';

  const eyeImageSrc = isShow ? IMAGE_BASE_PATH.EYE_KEY_PASSWORD : IMAGE_BASE_PATH.EYE_PASSWORD;
  eyeImage.src = eyeImageSrc;

  inputField.type = isShow ? 'password' : 'text';
  inputField.setAttribute('data-show-password', isShow ? 'hidden' : 'show');
};
