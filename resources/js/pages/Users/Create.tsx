import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Transition } from '@headlessui/react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"





const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/',
    },
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'New User',
        href: '/users/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
        email: '',
        password: '',
        level: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="p-8 overflow-y-auto">
                <div className="max-w-2xl">
                    <div className="mb-8">
                        <HeadingSmall title="Create New User" description="Define the details for your new user" />
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
                                <Label htmlFor="name">User Level</Label>
                                <Select onValueChange={(value) => setData('level', value)}>
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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    className="mt-1 block w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    placeholder="Password"
                                />
                                {errors.password && <InputError className="mt-2" message={errors.password} />}
                            </div>

                            <div className="grid gap-2 w-full">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    type="password"
                                    id="password_confirmation"
                                    className="mt-1 block w-full"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    placeholder="Confirm Password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>Create User</Button>
                            <Link href={route('users.index')}>Cancel</Link>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Created</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}