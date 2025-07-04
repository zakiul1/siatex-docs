import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Transition } from '@headlessui/react';
import { User } from '@/types'; // Assuming you have UserProps
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface EditProps {
    auth: {
        user: User;
    };
    user: User;
}

const breadcrumbs = (userName: string) => [
    {
        title: 'Dashboard',
        href: '/',
    },
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit User',
        href: '/users/edit', // You might need to adjust href dynamically if needed
    },
    {
        title: userName,
        href: '', // or dynamic user edit link if applicable
    },
];

export default function Edit({ user }: EditProps) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        password: '', // Password is optional for update
        level: user.level, //
        password_confirmation: '',
    });

    console.log(data);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(user.name)}>
            <Head title={`Edit User: ${user.name}`} />

            <div className="p-8 overflow-y-auto">
                <div className="max-w-2xl">
                    <div className="mb-8">
                        <HeadingSmall title="Edit User" description="Update the details for this user" />
                    </div>
                    <form onSubmit={submit} className="space-y-6">
                        <div className='flex gap-8 flex-col md:flex-row'>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="User Name"
                                />
                                {errors.name && <InputError className="mt-2" message={errors.name} />}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="level">User Level</Label>
                                <Select value={data.level} onValueChange={(value) => setData('level', value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a User Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Levels</SelectLabel>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="User">User</SelectItem>
                                            <SelectItem value="Supervisor">Supervisor</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.level && <InputError className="mt-2" message={errors.level} />}
                            </div>
                        </div>


                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="User Email"
                            />
                            {errors.email && <InputError className="mt-2" message={errors.email} />}
                        </div>


                        <div className='flex gap-8 flex-col md:flex-row'>
                            <div className="grid gap-2 w-full">
                                <Label htmlFor="password">Password (Leave blank to keep current)</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    className="mt-1 block w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="New Password (optional)"
                                />
                                {errors.password && <InputError className="mt-2" message={errors.password} />}
                            </div>

                            <div className="grid gap-2 w-full">
                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                <Input
                                    type="password"
                                    id="password_confirmation"
                                    className="mt-1 block w-full"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm New Password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>Update User</Button>
                            <Link href={route('users.index')}>Cancel</Link>

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