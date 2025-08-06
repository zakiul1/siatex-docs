// resources/js/Pages/Shippers/Index.tsx

import React, { useState, useEffect, useRef, Fragment } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, Transition } from '@headlessui/react';

type Shipper = {
  id: number;
  name: string;
  address: string;
  phone: string;
  mobile?: string | null;
  email?: string | null;
  website?: string | null;
  bank_ids: number[];
};

export default function Index() {
  const { shippers, toastData, filters, bankLookup } = usePage<{
    shippers: {
      data?: Shipper[];
      meta?: { current_page: number; last_page: number };
      current_page?: number;
      last_page?: number;
    };
    toastData?: { title: string; message: string; type: 'success' | 'error' };
    filters: { search?: string };
    bankLookup: Record<number, string>;
  }>().props;

  const [search, setSearch] = useState(filters.search || '');
  const debounce = useRef<number>();

  useEffect(() => {
    if (toastData) {
      toast(toastData.title, {
        description: toastData.message,
        type: toastData.type,
        dismissible: true,
      });
    }
  }, [toastData]);

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      router.get(
        route('shippers.index'),
        { search },
        { preserveState: true, replace: true }
      );
    }, 500);
    return () => clearTimeout(debounce.current);
  }, [search]);

  const data = shippers.data || [];
  const lastPage = shippers.meta?.last_page ?? shippers.last_page ?? 1;
  const currentPage =
    shippers.meta?.current_page ?? shippers.current_page ?? 1;

  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const onDeleteClick = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = () => {
    if (deletingId !== null) {
      router.delete(route('shippers.destroy', deletingId));
      setConfirmOpen(false);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Shippers', href: route('shippers.index') },
      ]}
    >
      <Head title="Shippers" />

      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search shippers..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="max-w-sm"
          />
          <Button asChild>
            <Link href={route('shippers.create')}>New Shipper</Link>
          </Button>
        </div>

        {data.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table className="min-w-full bg-white shadow-sm rounded">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Banks</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((shipper) => (
                  <TableRow key={shipper.id}>
                    <TableCell>{shipper.name}</TableCell>
                    <TableCell>{shipper.phone}</TableCell>
                    <TableCell>{shipper.mobile ?? '—'}</TableCell>
                    <TableCell>{shipper.email ?? '—'}</TableCell>
                    <TableCell>
                      {shipper.website
                        ? <a
                            href={shipper.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {new URL(shipper.website).hostname}
                          </a>
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {(shipper.bank_ids || [])
                        .map((id) => bankLookup[id] || '—')
                        .join(', ')}
                    </TableCell>
                    <TableCell>{shipper.address ?? '—'}</TableCell>
                    <TableCell className="flex justify-end items-center space-x-2">
                      <Link href={route('shippers.edit', shipper.id)}>
                        <Edit size={16} className="cursor-pointer" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(shipper.id)}
                        className="cursor-pointer"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Table>
            <TableCaption>No shippers yet.</TableCaption>
          </Table>
        )}

        {lastPage > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={currentPage === p ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  router.get(
                    route('shippers.index'),
                    { page: p, search },
                    { preserveState: true, replace: true }
                  )
                }
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setConfirmOpen(false)}
        >
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            as={Fragment}
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                as={Fragment}
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this shipper? This action
                      cannot be undone.
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setConfirmOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleConfirmDelete}
                    >
                      Delete
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
}
