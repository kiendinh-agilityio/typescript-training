export const handleTogglePassword = (togglePasswordButton: HTMLElement) => {
  const inputField = togglePasswordButton.parentElement!.querySelector('.show-password') as HTMLInputElement;
  const eyeImage = togglePasswordButton.querySelector('img') as HTMLImageElement;
  const isShow = inputField.getAttribute('data-show-password') === 'show';

  const eyeImageSrc = isShow ? '/images/svg/eye-key-password.svg' : '/images/svg/eye-password.svg';
  eyeImage.src = eyeImageSrc;

  inputField.type = isShow ? 'password' : 'text';
  inputField.setAttribute('data-show-password', isShow ? 'hidden' : 'show');
};
