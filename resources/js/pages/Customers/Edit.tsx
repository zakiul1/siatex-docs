import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Transition } from '@headlessui/react';

import { User } from '@/types';

interface EditProps {
    auth: {
        user: User;
    };
    customer: {
        id: number;
        name: string;
        mobile: string;
        address: string;
    };
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/',
    },
    {
        title: 'Customers',
        href: '/customers',
    },
    {
        title: 'Edit Customer',
        href: '/customers/edit',
    },
];

export default function Edit({ customer }: EditProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: customer.name,
        mobile: customer.mobile,
        address: customer.address,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('customers.update', customer.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Customer" />

            <div className="p-8 overflow-y-auto">
                <div className="max-w-2xl">
                    <div className="mb-8">
                        <HeadingSmall title="Edit Customer" description="Update the details for this customer" />
                    </div>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                type="text"
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Customer Name"
                            />
                            {errors.name && <InputError className="mt-2" message={errors.name} />}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="mobile">Mobile</Label>
                            <Input
                                type="text"
                                id="mobile"
                                className="mt-1 block w-full"
                                value={data.mobile}
                                onChange={(e) => setData('mobile', e.target.value)}
                                required
                                placeholder="Customer Mobile"
                            />
                            {errors.mobile && <InputError className="mt-2" message={errors.mobile} />}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                type="text"
                                id="address"
                                className="mt-1 block w-full"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Customer Address"
                            />
                            {errors.address && <InputError className="mt-2" message={errors.address} />}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>Update Customer</Button>
                            <Link href={route('customers.index')}>Cancel</Link>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Updated</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}