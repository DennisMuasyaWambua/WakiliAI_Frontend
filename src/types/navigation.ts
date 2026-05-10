import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  badge?: number;
  description?: string;
}

export interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}

export interface NavigationConfig {
  mainNav: NavigationItem[];
  sidebarNav: NavigationSection[];
}
