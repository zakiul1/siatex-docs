import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    group?: boolean;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

// Module types
export interface Module {
    actions: string[];
    title: string;
    icon?: string;
    'custom-route'?: string | false;
}

export interface Modules {
    primary: Record<string, Module>;
    secondary: Record<string, Module>;
    settings?: Record<string, Module>;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    modules: Modules;
    hasRegisterRoute: boolean;
    auth: Auth;
    [key: string]: unknown;
    permissions: Record<string, boolean> | undefined;
    toastData?: {
        type: 'success' | 'error' | 'info' | 'warning';
        title: string;
        message: string;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    isAdmin: boolean;
    isSAdmin: boolean;
    level: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Customer {
    id: number;
    name: string;
    mobile: string;
    address: string;
    created_at?: string;
    updated_at?: string;
}

interface Sale {
    id: number;
    customer_name: string; // Join customer name
    unit_price: number;
    quantity: number;
    total_value: number;
    date: string;
}

interface Payment {
    id: number;
    customer_name: string;
    amount: number;
    reference: string;
    date: string;
}
