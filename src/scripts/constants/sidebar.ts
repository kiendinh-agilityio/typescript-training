// Import interfaces for sidebar
import { SidebarItem } from '@/interfaces';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    href: '#',
    url: '/images/svg/home.svg',
    alt: 'Home icon',
    label: 'Dashboard',
  },
  {
    href: '/teacher-dashboard',
    url: '/images/svg/home.svg',
    alt: 'Teacher icon',
    label: 'Teachers',
  },
  {
    href: '/student-dashboard',
    url: '/images/svg/student.svg',
    alt: 'Students icon',
    label: 'Students/ classes',
  },
  {
    href: '#',
    url: '/images/svg/bank.svg',
    alt: 'Billing icon',
    label: 'Billing',
  },
  {
    href: '#',
    url: '/images/svg/setting.svg',
    alt: 'Settings icon',
    label: 'Settings and profile',
  },
  {
    href: '#',
    url: '/images/svg/chart.svg',
    alt: 'Exams icon',
    label: 'Exams',
  },
];
