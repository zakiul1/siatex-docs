// resources/js/components/nav-main.tsx

import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();

  const isItemActive = (item: NavItem) => {
    if (page.url === item.href) return true;
    if (item.children) {
      return item.children.some(child => page.url.startsWith(child.href));
    }
    return false;
  };

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(item => {
          const active = isItemActive(item);

          if (item.children && item.children.length > 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <details open={active} className="group">
                  <summary className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      {item.icon && <item.icon size={16} />}
                      <span className="text-md">{item.title}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${active ? 'rotate-180' : ''}`} />
                  </summary>
                  <SidebarMenu className="ml-6">
                    {item.children.map(child => {
                      const childActive = page.url === child.href;
                      return (
                        <SidebarMenuItem key={child.title}>
                          <SidebarMenuButton asChild isActive={childActive}>
                            <Link href={child.href} prefetch className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                              {child.icon && <child.icon />}
                              <span className="text-md">{child.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </details>
              </SidebarMenuItem>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={active}>
                <Link href={item.href} prefetch className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                  {item.icon && <item.icon />}
                  <span className="text-md">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
