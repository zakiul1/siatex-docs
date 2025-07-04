import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Module, SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

import AppLogo from './app-logo';

import { Box, Images, Boxes, FileBox, Grid, HandCoins, LayoutGrid, ListTree, Store, UsersRound, Tickets, LucideIcon } from 'lucide-react';
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
    Tickets,
    default: LayoutGrid,
};

const getIcon = (iconName?: string) => iconMap[iconName || 'default'];



export function AppSidebar() {
    // Fetch shared props
    const { modules, permissions, auth } = usePage<SharedData>().props;

    //primary.{module_key}.read // action 
    //  if (hasPermission(props.permissions, action, props.auth.user)) {
    const generateNavItems = (moduleData: Record<string, Module>, group: string): NavItem[] => {
        return Object.entries(moduleData).filter(([key]) => {
            // Construct permission string (assuming 'read' action is needed to show nav item)
            const permissionString = `${group}.${key}.read`;
            return hasPermission(permissions, permissionString, auth.user);
        }).map(([key, module]) => ({
            title: module.title,
            href: module['custom-route'] || `/${key}`,
            icon: getIcon(module.icon) as LucideIcon, // Cast to LucideIcon
            group: true,
        }));
    };

    // Create menu items
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...generateNavItems(modules.primary, 'primary'), // Dynamically generated items
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
