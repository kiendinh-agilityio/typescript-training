// Import constants
import { SIDEBAR_ITEMS } from '@/constants';

// Import interfaces for sidebar
import { SidebarItem } from '@/interfaces';

// Import function handleToggleSidebar
import { handleToggleSidebar } from '@/sidebar';

/**
 * Function to generate the sub-sidebar HTML
 */
const generateSubSidebar = (): string =>
  SIDEBAR_ITEMS.map((item: SidebarItem) => {
    // Destructure label, url, alt, and active properties from the item, defaulting to empty strings
    const { href = '', label = '', url = '', alt = '' } = item;

    // Return the HTML string for the sub-sidebar item
    return `
      <li class="sub-sidebar-item">
        <a class="flex wrapper-item items-center" href="${href}">
          <img
            class="item-icon"
            src="${url}"
            alt="${alt}"
            width="16px"
            height="16px"
          >
          <span class="text-side-item">${label}</span>
        </a>
      </li>
    `;
  }).join('');

/**
 * Function to generate the sidebar HTML
 */
const generateSidebar = (): string => `
  <div id="btn-toggle-group" class="flex justify-end btn-toggle-group">
    <button id="open-btn" class="btn-menu">
      <img
        width="20px"
        height="20px"
        src="/images/svg/toggle-icon.svg"
        alt="Toggle icon"
      />
    </button>
    <button id="close-btn" class="hidden btn-menu">
      <img
        width="20px"
        height="20px"
        src="/images/svg/close-menu.svg"
        alt="Button Close Menu"
      />
    </button>
  </div>
  <div id="sidebar" class="hidden sidebar">
    <div
      id="main-sidebar"
      class="flex-column items-center justify-between main-sidebar"
    >
      <div class="flex-column items-center">
        <a class="logo-sidebar" href="/">
          <img
            class="logo"
            width="40px"
            height="40px"
            src="/images/svg/logo.svg"
            alt="Udemy Inter School Logo"
          />
        </a>
        <p class="school-name">Udemy Inter. school</p>
      </div>
    </div>
    <div class="flex justify-center sub-sidebar-content">
      <ul class="sub-sidebar-list">
        ${generateSubSidebar()}
        <li class="flex justify-between items-center sub-sidebar-item features-item">
          <a class="flex wrapper-item items-center" href="#">
            <img
              class="item-icon"
              src="/images/svg/bank.svg"
              alt="Bank icon"
              width="16px"
              height="16px"
            >
            <span class="text-side-item">Features</span>
          </a>
          <p class="feature-label">NEW</p>
        </li>
      </ul>
    </div>
  </div>
`;

/**
 * Function to initialize the sidebar
 */
export const initializeSidebar = (): void => {
  // Get the DOM element for the sidebar section
  const sidebarSection = document.querySelector(
    '.sidebar-section',
  ) as HTMLElement;

  // Set the innerHTML of the sidebar section
  sidebarSection.innerHTML = generateSidebar();

  // Call handleToggleSidebar to manage the sidebar toggle
  handleToggleSidebar();

  // Add event listeners to sidebar items
  const sidebarItems = document.querySelectorAll('.sub-sidebar-item');

  // Function to set the active sidebar item
  const setActiveItem = (item: Element) => {
    sidebarItems.forEach((el) =>
      el.classList.remove('sidebar-active', 'sidebar-text-active'),
    );

    // Add active classes to the selected item
    item.classList.add('sidebar-active');
    const textSideItem = item.querySelector('.text-side-item');

    // Add the 'sidebar-text-active' class if the text side item exists
    if (textSideItem) textSideItem.classList.add('sidebar-text-active');
  };

  // Add click event listeners to all sidebar items
  sidebarItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      setActiveItem(item);
      const href = item.querySelector('a').getAttribute('href');

      // Navigate to the specified href
      if (href && href !== '#') window.location.href = href;
    });
  });

  // Get the current URL path
  const currentUrl = window.location.pathname;

  // Find the sidebar item matching the current URL
  const activeItem = document
    .querySelector(`a[href="${currentUrl}"]`)
    ?.closest('.sub-sidebar-item');

  // Set the active item based on the current URL or default to "Teachers" if no match is found
  setActiveItem(
    activeItem ||
      document
        .querySelector('a[href="/teacher-dashboard"]')
        .closest('.sub-sidebar-item'),
  );
};
