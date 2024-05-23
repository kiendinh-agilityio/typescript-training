// Import constants
import { MAIN_SIDEBAR_ITEMS, SUB_SIDEBAR_ITEMS, SIDEBAR_TITLE, SidebarItem } from '@/constants';

// Import function handleToggleSidebar
import { handleToggleSidebar } from '@/sidebar';

/**
 * Function to generate the main sidebar HTML
 */
const generateMainSidebar = (): string => MAIN_SIDEBAR_ITEMS.map((item: SidebarItem) => {
  // Destructure the url and alt properties from the item, defaulting to empty strings
  const { url = '', alt = '' } = item;

  // Return the HTML string for each item
  return `
    <li>
      <a href="#">
        <img
          loading="lazy"
          width="14px"
          height="14px"
          src="${url}"
          alt="${alt}"
        />
      </a>
    </li>`;
}).join('');

/**
 * // Function to generate the sub-sidebar HTML
 */
const generateSubSidebar= (): string => SUB_SIDEBAR_ITEMS.map((item: SidebarItem) => {
  // Destructure label, url, alt, and active properties from the item, defaulting to empty strings
  const { label = '', url = '', alt = '', active = '' } = item;

  // If the label is FAVOURITES or ACTIVE, return the HTML for the title
  if (label === SIDEBAR_TITLE.FAVOURITES || label === SIDEBAR_TITLE.ACTIVE) {
    return `
      <li class="sidebar-item-title">${label}</li>
    `;
  } else {
    // Return the HTML string for the sub-sidebar item
    return `
      <li class="sub-sidebar-item ${active && 'sidebar-active'}">
        <a class="flex wrapper-item" href="#">
          <img
            class="item-icon"
            src="${url}"
            alt="${alt}"
            width="14px"
            height="14px"
          >
          <span class="text-side-item ${
            active && 'sidebar-text-active'
          }">${label}</span>
        </a>
      </li>
    `;
  }
}).join('');

/**
 * Function to initialize the sidebar
 */
export const initializeSidebar = (): void => {
  // Get the DOM elements for the main sidebar and sub-sidebar
  const mainSidebarList = document.querySelector('.main-sidebar-list') as HTMLElement;
  const subSidebarList = document.querySelector('.sub-sidebar-list') as HTMLElement;

  // Set the innerHTML of the sub-sidebar and main sidebar
  subSidebarList.innerHTML = generateSubSidebar();
  mainSidebarList.innerHTML = generateMainSidebar();

  // Call handleToggleSidebar to manage the sidebar toggle functionality
  handleToggleSidebar();
};
