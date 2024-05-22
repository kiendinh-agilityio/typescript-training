import { DISPLAY_CLASS } from "@/constants";

const loadingContainer = document.getElementById('loading-container') as HTMLElement;

const loadingSpinner = {
  start: function (): void {
    loadingContainer.style.display = DISPLAY_CLASS.FLEX;
  },

  stop: function (): void {
    loadingContainer.style.display = DISPLAY_CLASS.HIDDEN;
  },
};

export const startLoadingSpinner = (): void => {
  loadingSpinner.start();
};

export const stopLoadingSpinner = (): void => {
  loadingSpinner.stop();
};

export const delayAction = (callback: () => void, delayTime: number = 1000): void => {
  startLoadingSpinner();
  setTimeout(() => {
    callback();
  }, delayTime);
};
