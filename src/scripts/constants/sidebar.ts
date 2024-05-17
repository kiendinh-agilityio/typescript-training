interface SidebarItem {
  url?: string;
  alt?: string;
  text?: string;
  active?: boolean;
}

export const MAIN_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    url: '/images/svg/folder.svg',
    alt: 'Folder icon',
  },
  {
    url: '/images/svg/loudspeaker-green.svg',
    alt: 'Loudspeaker icon',
  },
  {
    url: '/images/svg/s-pulse.svg',
    alt: 'S-pulse icon',
  },
  {
    url: '/images/svg/bolt.svg',
    alt: 'Bolt icon',
  },
  {
    url: '/images/svg/input.svg',
    alt: 'Input icon',
  },
];

export const SUB_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    text: 'FAVOURITES',
  },
  {
    url: '/images/svg/favorite.svg',
    alt: 'Favorite icon',
    text: 'Waterloo',
  },
  {
    url: '/images/svg/favorite.svg',
    alt: 'Favorite icon',
    text: 'Austerlitz',
    active: true,
  },
  {
    text: 'ACTIVE',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    text: 'Anais',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    text: 'Minimal apps',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    text: 'Bentley',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    text: 'Aston Martin',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    text: 'Rolex',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    text: 'Dugarry',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    text: 'Obama',
  },
];
