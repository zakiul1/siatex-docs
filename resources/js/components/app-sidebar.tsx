// resources/js/components/app-sidebar.tsx

import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Module, SharedData, type NavItem } from '@/types';
import AppLogo from './app-logo';
import {
  Box,
  Images,
  Boxes,
  ListTree,
  HandCoins,
  FileBox,
  Store,
  UsersRound,
  Grid,
  Truck,
  Tickets,
  LucideIcon,
    LayoutGrid,
  FileText 
} from 'lucide-react';
import { hasPermission } from '@/lib/PermissionCheck';

// Icon mapping
const iconMap: Record<string, React.ComponentType> = {
  Box,
  Images,
  Boxes,
  ListTree,
  HandCoins,
  FileBox,
  Store,
  UsersRound,
  Grid,
  Truck,
    Tickets,
  FileText ,
  default: LayoutGrid,
};

const getIcon = (iconName?: string) => iconMap[iconName || 'default'];

export function AppSidebar() {
  const { modules, permissions, auth } = usePage<SharedData>().props;

  const generateNavItems = (moduleData: Record<string, Module>, group: string): NavItem[] => {
    return Object.entries(moduleData)
      .filter(([key, module]) =>
        hasPermission(permissions, `${group}.${key}.read`, auth.user)
      )
      .map(([key, module]) => {
        const Icon = getIcon(module.icon) as LucideIcon;
        const href = module['custom-route'] || `/${key}`;
        const navItem: NavItem = {
          title: module.title,
          href,
          icon: Icon,
        };
        if (module.children) {
          navItem.children = generateNavItems(module.children, `${group}.${key}`);
        }
        return navItem;
      });
  };

  const mainNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutGrid,
    },
    ...generateNavItems(modules.primary, 'primary'),
  ];

  const footerNavItems: NavItem[] = generateNavItems(modules.secondary, 'secondary');

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
