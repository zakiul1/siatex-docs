import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePoll } from '@inertiajs/react';
import { SharedData, Customer, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption,
} from "@/components/ui/table";
import { Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import Confirm from '@/components/confirm';
import { PermissionCheck } from '@/lib/PermissionCheck';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/customers' },
];

interface IndexProps extends SharedData {
    customers: {
        data: Customer[];
        current_page: number;
        is_take_screenshot: boolean
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function Index({ customers, toastData }: IndexProps) {

    console.log(toastData);
    const handlePageChange = (page: number | null) => {
        if (page) {
            router.get(route('customers.index', { page }));
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
            <Head title="Customers" />
            <div className="p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-4">
                        <Button asChild>
                            <Link href={route('customers.create')}>
                                Create New Customer
                            </Link>
                        </Button>
                    </div>
                    {customers.data.length > 0 ? (
                        <>
                            <div className='mt-6 overflow-hidden shadow-sm rounded-lg'>
                                <Table className='min-w-full bg-white shadow rounded dark:bg-neutral-800'>
                                    <TableHeader className='bg-neutral-200 dark:bg-neutral-700'>
                                        <TableRow className='border-b dark:border-neutral-600'>
                                            <TableHead className='px-4 py-2 text-left text-neutral-600 dark:text-neutral-300'>Name</TableHead>
                                            <TableHead className='px-4 py-2 text-left text-neutral-600 dark:text-neutral-300'>Mobile</TableHead>
                                            <TableHead className='px-4 py-2 text-left text-neutral-600 dark:text-neutral-300'></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customers.data.map((customer) => (
                                            <TableRow key={customer.id} className='border-b dark:border-neutral-900'>
                                                <TableCell className="font-medium px-4 py-2 text-neutral-800 dark:text-neutral-100">{customer.name}</TableCell>
                                                <TableCell className="font-medium px-4 py-2 text-neutral-800 dark:text-neutral-100">{customer.mobile}</TableCell>
                                                <TableCell className="text-right px-4 py-2 text-neutral-800 dark:text-neutral-100">
                                                    <div className='flex items-center gap-2 justify-end'>
                                                        <PermissionCheck
                                                            action="secondary.customer.write"
                                                        >
                                                            <Button asChild variant="ghost" size="sm">
                                                                <Link href={route('customers.edit', customer.id)}>
                                                                    <Edit className="h-4 w-4 mr-1" />Edit
                                                                </Link>
                                                            </Button>
                                                        </PermissionCheck>
                                                        <PermissionCheck
                                                            action="secondary.customer.delete"
                                                        >
                                                            <Confirm
                                                                trigger={
                                                                    <Trash2 className='w-4 h-6 text-red-700' />
                                                                }
                                                            >
                                                                <Link href={route('customers.destroy', customer.id)} method="delete" as="button">
                                                                    <span>Delete</span>
                                                                </Link>
                                                            </Confirm>
                                                        </PermissionCheck>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {customers.last_page > 1 && (
                                <div className="flex justify-center items-center justify-end mt-4 space-x-2">
                                    {customers.links.map((link, index) => {
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
                            <TableCaption>No customers created yet.</TableCaption>
                        </Table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}