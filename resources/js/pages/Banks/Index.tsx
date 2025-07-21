// resources/js/Pages/Banks/Index.tsx

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

type Bank = {
  id: number;
  bank_type: 'customer' | 'factory';
  name: string;
  swift_code: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
};

export default function Index() {
  const { banks, toastData, filters } = usePage<{
    banks: {
      data: Bank[];
      current_page?: number;
      last_page?: number;
      meta?: { current_page: number; last_page: number };
    };
    toastData?: { title: string; message: string; type: 'success' | 'error' };
    filters: { search?: string };
  }>().props;

  // seed search from filters
  const [search, setSearch] = useState<string>(filters.search || '');
  const debounce = useRef<number>();

  // show toast after create/update/delete
  useEffect(() => {
    if (toastData) {
      toast(toastData.title, {
        description: toastData.message,
        type: toastData.type,
        dismissible: true,
      });
    }
  }, [toastData]);

  // live search debounce
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      router.get(
        route('banks.index'),
        { search },
        { preserveState: true, replace: true }
      );
    }, 500);
    return () => clearTimeout(debounce.current);
  }, [search]);

  const data = banks.data || [];
  const lastPage = banks.meta?.last_page ?? banks.last_page ?? 1;
  const currentPage = banks.meta?.current_page ?? banks.current_page ?? 1;

  // delete modal state
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const onDeleteClick = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = () => {
    if (deletingId !== null) {
      router.delete(route('banks.destroy', deletingId));
      setConfirmOpen(false);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Banks',     href: route('banks.index') },
      ]}
    >
      <Head title="Banks" />

      <div className="p-8 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search banks..."
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
            className="max-w-sm"
          />
          <Button asChild>
            <Link href={route('banks.create')}>Create New Bank</Link>
          </Button>
        </div>

        {data.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table className="min-w-full bg-white shadow-sm rounded">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Swift Code</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(bank => (
                  <TableRow key={bank.id}>
                    <TableCell>{bank.name}</TableCell>
                    <TableCell>
                      {bank.bank_type === 'customer' ? 'Customer' : 'Factory'}
                    </TableCell>
                    <TableCell>{bank.swift_code ?? '—'}</TableCell>
                    <TableCell>{bank.phone ?? '—'}</TableCell>
                    <TableCell>{bank.email ?? '—'}</TableCell>
                 <TableCell className="flex justify-end items-center space-x-2">
  <Link href={route('banks.edit', bank.id)}>
    <Edit size={16} className="cursor-pointer" />
  </Link>
  <button
    type="button"
    onClick={() => onDeleteClick(bank.id)}
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
            <TableCaption>No banks have been added yet.</TableCaption>
          </Table>
        )}

        {lastPage > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                variant={currentPage === p ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  router.get(
                    route('banks.index'),
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

      {/* Confirm Delete Modal */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setConfirmOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this bank? This action cannot be undone.
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" type="button" onClick={() => setConfirmOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" type="button" onClick={handleConfirmDelete}>
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
