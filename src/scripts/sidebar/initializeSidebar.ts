import { MAIN_SIDEBAR_ITEMS, SUB_SIDEBAR_ITEMS } from '@/constants';
import { handleSidebarToggle } from '@/sidebar';

const generateMainSideNav = MAIN_SIDEBAR_ITEMS.map((item) => {
  const { url, alt } = item;

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

const generateSubSideNav = SUB_SIDEBAR_ITEMS.map((item) => {
  const { text, url, alt, active } = item;
  if (text === 'FAVOURITES' || text === 'ACTIVE') {
    return `
      <li class="sidebar-item-title">${text}</li>
    `;
  } else {
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
          <span class="text-side-item ${active && 'sidebar-text-active'}">${text}</span>
        </a>
      </li>
    `;
  }
}).join('');

export const initializeSidebar = () => {
  const mainSidebarList = document.querySelector('.main-sidebar-list');
  const subSidebarList = document.querySelector('.sub-sidebar-list');

  subSidebarList.innerHTML = generateSubSideNav;
  mainSidebarList.innerHTML = generateMainSideNav;

  handleSidebarToggle();
};
