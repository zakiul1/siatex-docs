import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePoll } from '@inertiajs/react';
import { SharedData, User as UserProps, type BreadcrumbItem } from '@/types'; // Assuming you have UserProps in types
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption,
} from "@/components/ui/table"
import { Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import Confirm from '@/components/confirm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/',
    },
    {
        title: 'Users',
        href: '/users',
    }
];

interface IndexProps extends SharedData {
    users: {
        data: UserProps[];
        current_page: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function Index({ users, toastData }: IndexProps) {
    

    const handlePageChange = (page: number | null) => {
        if (page) {
            router.get(route('users.index', { page }));
        }
    };

    useEffect(() => {
        if (toastData) {
            toast(toastData.title, {
                description: toastData.message,
                type: toastData.type,
                dismissible: true,
            });
        }
    }, [toastData]);

    usePoll(10000);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto ">
                    <div className="mb-4">
                        <Button asChild>
                            <Link href={route('users.create')}>
                                Create New User
                            </Link>
                        </Button>
                    </div>
                    {users.data.length > 0 ? (
                        <>
                            <div className='mt-6 overflow-hidden shadow-sm rounded-lg'>
                                <Table className='min-w-full bg-white shadow rounded dark:bg-neutral-800'>
                                    <TableHeader className='bg-neutral-200 dark:bg-neutral-700'>
                                        <TableRow className='border-b dark:border-neutral-600'>
                                            <TableHead className='px-4 py-2 text-left text-neutral-600 dark:text-neutral-300'>Name</TableHead>
                                            <TableHead className='px-4 py-2 text-left text-neutral-600 dark:text-neutral-300'>Email</TableHead>
                                            <TableHead className='px-4 py-2 text-left text-neutral-600 dark:text-neutral-300'>User level</TableHead>
                                            <TableHead className='px-4 py-2 text-left text-neutral-600 dark:text-neutral-300'></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.map((user) => (
                                            <TableRow key={user.id} className='border-b dark:border-neutral-900'>
                                                <TableCell className="font-medium px-4 py-2 text-neutral-800 dark:text-neutral-100">{user.name}</TableCell>
                                                <TableCell className="font-medium px-4 py-2 text-neutral-800 dark:text-neutral-100">{user.email}</TableCell>
                                                <TableCell className="font-medium px-4 py-2 text-neutral-800 dark:text-neutral-100">{user.level}</TableCell>
                                                <TableCell className="text-right px-4 py-2text-neutral-800 dark:text-neutral-100">
                                                    <div className='flex items-center gap-2 justify-end'>
                                                        <Link href={route("users.permissions.edit", user.id)}>
                                                            <Button>Manage Permissions</Button>
                                                        </Link>
                                                        <Button asChild variant="ghost" size="sm">
                                                            <Link href={route('users.edit', user.id)}>
                                                                <Edit className="h-4 w-4 mr-1" />Edit
                                                            </Link>
                                                        </Button>
                                                        <Confirm
                                                            trigger={
                                                                <Trash2 className='w-4 h-6  text-red-700' />
                                                            }
                                                        >
                                                            <Link href={route('users.destroy', user.id)} method="delete" as="button">
                                                                <span>Delete</span>
                                                            </Link>
                                                        </Confirm>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {users.last_page > 1 && (
                                <div className="flex justify-center items-center justify-end mt-4 space-x-2">
                                    {users.links.map((link, index) => {
                                        const isMobileVisible = link.label.includes('Previous') || link.label.includes('Next') || link.active;
                                        return (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                className={`${isMobileVisible ? 'block' : 'hidden md:block'
                                                    }`}
                                                onClick={() => handlePageChange(link.url ? new URL(link.url).searchParams.get('page') : null)}
                                                disabled={!link.url}
                                            >
                                                {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        <Table>
                            <TableCaption>No users created yet.</TableCaption>
                        </Table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}