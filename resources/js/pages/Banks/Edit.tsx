import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Select, { SingleValue } from 'react-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Transition } from '@headlessui/react';

type TypeOption = { value: string; label: string };

export default function Edit({
  bank,
  types,
}: {
  bank: {
    id:         number;
    bank_type:  string;
    name:       string;
    swift_code: string | null;
    address:    string | null;
    phone:      string | null;
    email:      string | null;
  };
  types: TypeOption[];
}) {
  const options: TypeOption[] = types;

  const { data, setData, put, processing, errors, recentlySuccessful } =
    useForm({
      bank_type:  bank.bank_type,
      name:       bank.name,
      swift_code: bank.swift_code || '',
      address:    bank.address || '',
      phone:      bank.phone || '',
      email:      bank.email || '',
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('banks.update', bank.id));
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Banks',     href: route('banks.index') },
        { title: 'Edit',      href: route('banks.edit', bank.id) },
      ]}
    >
      <Head title="Edit Bank" />

      <div className="p-8">
        <div className="max-w-2xl space-y-6">
          <HeadingSmall
            title="Edit Bank"
            description={`Modify "${bank.name}"`}
          />

          <form onSubmit={submit} className="space-y-6">
            {/* Type */}
            <div className="grid gap-2">
              <Label htmlFor="bank_type">Type</Label>
              <Select
                inputId="bank_type"
                options={options}
                value={options.find(o => o.value === data.bank_type) || null}
                onChange={(selected: SingleValue<TypeOption>) =>
                  setData('bank_type', selected?.value || '')
                }
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="-- Select type --"
              />
              <InputError message={errors.bank_type} />
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.currentTarget.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <InputError message={errors.name} />
            </div>

            {/* SWIFT */}
            <div className="grid gap-2">
              <Label htmlFor="swift_code">SWIFT Code</Label>
              <input
                id="swift_code"
                value={data.swift_code}
                onChange={e => setData('swift_code', e.currentTarget.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
              <InputError message={errors.swift_code} />
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <input
                id="address"
                value={data.address}
                onChange={e => setData('address', e.currentTarget.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
              <InputError message={errors.address} />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <input
                id="phone"
                value={data.phone}
                onChange={e => setData('phone', e.currentTarget.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
              <InputError message={errors.phone} />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={e => setData('email', e.currentTarget.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
              <InputError message={errors.email} />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={processing}>Save</Button>
              <Link href={route('banks.index')}>Cancel</Link>
            </div>

            <Transition
              show={recentlySuccessful}
              enter="transition duration-200"
              enterFrom="opacity-0 translate-y-1"
              leave="transition duration-150"
              leaveTo="opacity-0"
            >
              <p className="text-sm text-green-600">Saved!</p>
            </Transition>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
