export interface SidebarItem {
  url?: string;
  alt?: string;
  label?: string;
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
    label: 'FAVOURITES',
  },
  {
    url: '/images/svg/favorite.svg',
    alt: 'Favorite icon',
    label: 'Waterloo',
  },
  {
    url: '/images/svg/favorite.svg',
    alt: 'Favorite icon',
    label: 'Austerlitz',
    active: true,
  },
  {
    label: 'ACTIVE',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    label: 'Anais',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    label: 'Minimal apps',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    label: 'Bentley',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    label: 'Aston Martin',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    label: 'Rolex',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    label: 'Dugarry',
  },
  {
    url: '/images/svg/loudspeaker.svg',
    alt: 'Loudspeaker icon',
    label: 'Obama',
  },
];
