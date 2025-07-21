import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Transition } from '@headlessui/react';

type TypeOption = { value: string; label: string };

export default function Create({ types }: { types: TypeOption[] }) {
  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
    bank_type: '',
    name: '',
    swift_code: '',
    address: '',
    phone: '',
    email: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('banks.store'));
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Banks',    href: route('banks.index') },
        { title: 'Create',   href: route('banks.create') },
      ]}
    >
      <Head title="Create Bank" />

      <div className="p-8">
        <div className="max-w-2xl space-y-6">
          <HeadingSmall title="New Bank" description="Add a bank" />

          <form onSubmit={submit} className="space-y-6">
            {/* Type */}
            <div className="grid gap-2">
              <Label htmlFor="bank_type">Type</Label>
              <select
                id="bank_type"
                className="block w-full rounded-md border-gray-300"
                value={data.bank_type}
                onChange={e => setData('bank_type', e.currentTarget.value)}
              >
                <option value="">-- Select --</option>
                {types.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <InputError message={errors.bank_type} />
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.currentTarget.value)}
              />
              <InputError message={errors.name} />
            </div>

            {/* Swift */}
            <div className="grid gap-2">
              <Label htmlFor="swift_code">SWIFT Code</Label>
              <Input
                id="swift_code"
                value={data.swift_code}
                onChange={e => setData('swift_code', e.currentTarget.value)}
              />
              <InputError message={errors.swift_code} />
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={data.address}
                onChange={e => setData('address', e.currentTarget.value)}
              />
              <InputError message={errors.address} />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={e => setData('phone', e.currentTarget.value)}
              />
              <InputError message={errors.phone} />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={data.email}
                onChange={e => setData('email', e.currentTarget.value)}
              />
              <InputError message={errors.email} />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={processing}>Create</Button>
              <Link href={route('banks.index')}>Cancel</Link>
            </div>

            <Transition
              show={recentlySuccessful}
              enter="transition duration-200"
              enterFrom="opacity-0 translate-y-1"
              leave="transition duration-150"
              leaveTo="opacity-0"
            >
              <p className="text-sm text-green-600">Created!</p>
            </Transition>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
