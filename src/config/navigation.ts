import { LayoutDashboard, Building2 } from 'lucide-react';
import { NavigationConfig } from '@/types/navigation';

export const navigationConfig: NavigationConfig = {
  mainNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview of your legal practice',
    },
    {
      title: 'Firm Management',
      href: '/dashboard/firm',
      icon: Building2,
      description: 'Manage your law firm details',
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
        {
          title: 'Firm Management',
          href: '/dashboard/firm',
          icon: Building2,
          description: 'Manage your law firm details',
        },
      ],
    },
  ],
};
