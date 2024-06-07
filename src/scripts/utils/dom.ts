/**
 * @template T - Expected HTML element type.
 * @param {string} id/selector - ID or CSS selector of the element.
 * @returns {T} - The HTML element casted to type T.
 */
const getElementById = <T extends HTMLElement>(id: string): T =>
  document.getElementById(id) as T;

const querySelector = <T extends HTMLElement>(selector: string): T =>
  document.querySelector(selector) as T;

// Get the element with ID 'authen-section'
export const authSection = getElementById<HTMLDivElement>('authen-section');

// Get the first element with class 'ads-search'
export const adsSearchElement = querySelector<HTMLDivElement>('.ads-search');

// Get the element with ID 'modal'
export const modalAds = getElementById('modal');
export const deleteModal = getElementById('delete-modal');
