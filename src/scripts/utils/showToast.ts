// Function to create toast container
const createToastContainer = (message: string, icon: string, isSuccess: boolean): HTMLDivElement => {
  const toastContainer = document.createElement('div');

  const toastTextClass = isSuccess ? 'toast-text-success' : 'toast-text-error';

  toastContainer.innerHTML = `
      <div class="toast items-center">
        <img width="30px" height="30px" src="../images/svg/${icon}" alt="${icon}">
        <p class="toast-text ${toastTextClass}">${message}</p>
      </div>
  `;
  return toastContainer;
};

// Function to display toast
export const showToast = (message: string, icon: string, isSuccess: boolean): void => {
  const toastContainer = createToastContainer(message, icon, isSuccess);
  document.body.appendChild(toastContainer);

  toastContainer.style.display = 'flex';

  setTimeout(() => {
    toastContainer.style.display = 'none';
    document.body.removeChild(toastContainer);
  }, 2000);
};
