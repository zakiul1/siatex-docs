import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Transition } from '@headlessui/react';
import { Modules } from '@/types';



interface PermissionManagerProps {
    user: {
        id: number;
        name: string;
    };
    modules: Modules;
    permissions: Record<string, boolean>;
}


const breadcrumbs = (userName: string) => [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Permission - ' + userName,
        href: '', // You might need to adjust href dynamically if needed
    }
];

const PermissionManager: React.FC<PermissionManagerProps> = ({ user, modules, permissions: initialPermissions }) => {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        permissions: initialPermissions,
    });



    const handleSwitchChange = (module: string, action: string, category: string) => {
        const key = `${category}.${module}.${action}`;
        setData("permissions", {
            ...data.permissions,
            [key]: !data.permissions[key],
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("users.permissions.update", user.id));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs(user.name)}>
            <Head title={`Edit User: ${user.name}`} />

            <div className="p-8 overflow-y-auto">
                <div className="max-w-2xl">
                    <div className="mb-8">
                        <HeadingSmall icon={ShieldCheck} title="Update user Permission" description="Switch on below that permission you want to allow." />
                    </div>
                </div>
                <form className='md:px-8 py-1 md:py-5 px-1' onSubmit={handleSubmit}>
                    {Object.entries(modules).map(([category, moduleActions]) => (
                        <div key={category} className="mb-6">
                            <h3 className="text-md font-semibold capitalize flex items-center gap-2 mb-3"><span className='w-5 h-5 rounded-sm inline-block bg-neutral-500/20'></span>{category}</h3>
                            {Object.entries(moduleActions).map(([module, moduleDetails]) => (
                                <div key={module} className="mb-4 flex items-center">
                                    <h4 className="font-medium min-w-32 capitalize text-sm">{module}</h4>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        {moduleDetails.actions.map((action) => {
                                            const key = `${category}.${module}.${action}`;
                                            return (
                                                <div key={key} className="flex items-center gap-2">
                                                    <Switch
                                                        checked={data.permissions[key] || false}
                                                        onCheckedChange={() => handleSwitchChange(module, action, category)}
                                                    />
                                                    <span className="capitalize text-xs">{action}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>Update</Button>
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

        </AppLayout>
    );
}

export default PermissionManager;