import { DISPLAY_CLASS } from '@/constants';

export const toggleDropdown = (element: HTMLElement): void => {
  element.style.display = element.style.display === DISPLAY_CLASS.FLEX ? DISPLAY_CLASS.HIDDEN : DISPLAY_CLASS.FLEX;
};
