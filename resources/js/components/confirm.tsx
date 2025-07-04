import React from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ConfirmProps {
    trigger: React.ReactNode; // Element that triggers the tooltip
    title?: string; // Content displayed in the tooltip
    description?: string; // Optional additional styling for the tooltip
    children: React.ReactNode; // This will allow passing children (like the confirm button)
}

const Confirm: React.FC<ConfirmProps> = ({ trigger, title, description, children }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title ?? 'Are you absolutely sure ?'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description ?? 'This action cannot be undone. Are you sure you want to do this?'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        {children}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Confirm;
