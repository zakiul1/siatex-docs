// resources/js/Pages/Shippers/Edit.tsx

import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Transition } from '@headlessui/react';
import Select, { MultiValue } from 'react-select';

type BankOption = { id: number; name: string };
type Option     = { value: number; label: string };
type Shipper    = {
  id: number;
  name: string;
  address: string;
  phone: string;
  mobile?: string | null;
  email?: string | null;
  website?: string | null;
  bank_ids: number[];
};

export default function Edit() {
  const { shipper, banks } = usePage<{
    shipper: Shipper;
    banks: BankOption[];
  }>().props;

  const options: Option[] = banks.map(b => ({
    value: b.id,
    label: b.name,
  }));

  const { data, setData, put, processing, errors, recentlySuccessful } =
    useForm({
      name:      shipper.name,
      address:   shipper.address,
      phone:     shipper.phone,
      mobile:    shipper.mobile || '',
      email:     shipper.email || '',
      website:   shipper.website || '',
      bank_ids:  shipper.bank_ids,
    });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('shippers.update', shipper.id));
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Shippers', href: '/shippers' },
        { title: 'Edit Shipper', href: `/shippers/${shipper.id}/edit` },
      ]}
    >
      <Head title="Edit Shipper" />

      <div className="p-8 max-w-2xl">
        <HeadingSmall
          title="Edit Shipper"
          description="Update details and associated banks"
        />

        <form onSubmit={submit} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <input
              id="name"
              name="name"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            {errors.name && <InputError message={errors.name} />}
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address</Label>
            <input
              id="address"
              name="address"
              value={data.address}
              onChange={e => setData('address', e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            {errors.address && <InputError message={errors.address} />}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <input
              id="phone"
              name="phone"
              value={data.phone}
              onChange={e => setData('phone', e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            {errors.phone && <InputError message={errors.phone} />}
          </div>

          {/* Mobile */}
          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <input
              id="mobile"
              name="mobile"
              value={data.mobile}
              onChange={e => setData('mobile', e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.mobile && <InputError message={errors.mobile} />}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.email && <InputError message={errors.email} />}
          </div>

          {/* Website */}
          <div>
            <Label htmlFor="website">Website</Label>
            <input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              value={data.website}
              onChange={e => setData('website', e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.website && <InputError message={errors.website} />}
          </div>

          {/* Banks multi‑select */}
          <div>
            <Label htmlFor="bank_ids">Banks</Label>
            <Select
              inputId="bank_ids"
              isMulti
              options={options}
              value={options.filter(o => data.bank_ids.includes(o.value))}
              onChange={(selected: MultiValue<Option>) =>
                setData(
                  'bank_ids',
                  selected.map(s => s.value)
                )
              }
              className="mt-1"
              classNamePrefix="react-select"
              placeholder="Select banks..."
            />
            {errors.bank_ids && <InputError message={errors.bank_ids} />}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={processing}>
              Update
            </Button>
            <Link href={route('shippers.index')}>Cancel</Link>
            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in-out duration-300"
              leaveTo="opacity-0"
            >
              <p className="text-sm text-green-600">Updated!</p>
            </Transition>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
