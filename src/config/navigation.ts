import { LayoutDashboard } from 'lucide-react';
import { NavigationConfig } from '@/types/navigation';

export const navigationConfig: NavigationConfig = {
  mainNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview of your legal practice',
    },
  ],
  sidebarNav: [
    {
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          description: 'Overview of your legal practice',
        },
      ],
    },
  ],
};
