// resources/js/Pages/Customers/Index.tsx

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

type Customer = {
  id: number;
  name: string;
  mobile: string;
  address: string | null;
};

export default function Index() {
  const { customers, toastData, filters } = usePage<{
    customers: {
      data: Customer[];
      current_page?: number;
      last_page?: number;
      meta?: { current_page: number; last_page: number };
    };
    toastData?: { title: string; message: string; type: 'success' | 'error' };
    filters: { search?: string };
  }>().props;

  // seed search from filters.search
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
        route('customers.index'),
        { search },
        { preserveState: true, replace: true }
      );
    }, 500);
    return () => clearTimeout(debounce.current);
  }, [search]);

  const data = customers.data || [];
  const lastPage = customers.meta?.last_page ?? customers.last_page ?? 1;
  const currentPage = customers.meta?.current_page ?? customers.current_page ?? 1;

  // delete modal state
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const onDeleteClick = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = () => {
    if (deletingId !== null) {
      router.delete(route('customers.destroy', deletingId));
      setConfirmOpen(false);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Customers', href: route('customers.index') },
      ]}
    >
      <Head title="Customers" />

      <div className="p-8 space-y-4">
        {/* Search + New */}
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
            className="max-w-sm"
          />
          <Button asChild>
            <Link href={route('customers.create')}>New Customer</Link>
          </Button>
        </div>

        {/* Table */}
        {data.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table className="min-w-full bg-white shadow-sm rounded">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(cust => (
                  <TableRow key={cust.id}>
                    <TableCell>{cust.name}</TableCell>
                    <TableCell>{cust.mobile}</TableCell>
                    <TableCell>{cust.address ?? '—'}</TableCell>
                  <TableCell className="flex justify-end items-center space-x-2">
  <Link href={route('customers.edit', cust.id)}>
    <Edit size={16} className="cursor-pointer" />
  </Link>
  <button
    type="button"
    onClick={() => onDeleteClick(cust.id)}
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
            <TableCaption>No customers yet.</TableCaption>
          </Table>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                variant={currentPage === p ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  router.get(
                    route('customers.index'),
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this customer? This action cannot be undone.
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirmDelete}>
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
