import React from "react";
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";

// Helper Function
export function hasPermission(
    permissions: Record<string, boolean> | undefined,
    action: string,
    user: { isSAdmin: boolean }
): boolean {
    if (user.isSAdmin) {
        return true;
    }

    // Check if the specific permission exists and is true
    return permissions?.[action] ?? false;
}

// React Component
type PermissionProps = {
    action: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

export const PermissionCheck: React.FC<PermissionProps> = ({
    action,
    fallback = null,
    children,
}) => {
    const { props } = usePage<SharedData>();

    if (hasPermission(props.permissions, action, props.auth.user)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
