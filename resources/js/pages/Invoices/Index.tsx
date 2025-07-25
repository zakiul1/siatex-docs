// resources/js/Pages/Invoices/Index.tsx
import React, { useState, useEffect, useRef, Fragment } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableHeader, TableHead, TableBody,
  TableRow, TableCell, TableCaption,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'sonner';

type InvoiceRow = {
  id: number;
  invoice_number: string;
  type: 'sample' | 'sales';
  shipper: string;
  customer: string;
  date: string;
  total_amount: number;
};

export default function Index() {
  // Pull props, default filters to {} so filters.search won't error
  const { invoices, toastData, filters = {} } = usePage<{
    invoices: {
      data: InvoiceRow[];
      meta?: { last_page: number; current_page: number };
    };
    toastData?: { title: string; message: string; type: 'success' | 'error' };
    filters?: { search?: string };
  }>().props;

  // Destructure data and default meta if undefined
  const data = invoices.data || [];
  const meta = invoices.meta || { last_page: 1, current_page: 1 };

  // Search state with debounce
  const [search, setSearch] = useState(filters.search ?? '');
  const debounce = useRef<number>();

  useEffect(() => {
    if (toastData) {
      toast(toastData.title, { description: toastData.message, type: toastData.type });
    }
  }, [toastData]);

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      router.get(route('invoices.index'), { search }, {
        preserveState: true,
        replace: true,
      });
    }, 500);
    return () => clearTimeout(debounce.current);
  }, [search]);

  // Delete‑confirm modal logic
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  function onDeleteClick(id: number) {
    setDeletingId(id);
    setConfirmOpen(true);
  }
  function handleDelete() {
    if (deletingId !== null) {
      router.delete(route('invoices.destroy', deletingId), {
        onSuccess: () => setConfirmOpen(false),
      });
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Invoices', href: route('invoices.index') },
      ]}
    >
      <Head title="Invoices" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search invoice…"
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
            className="max-w-sm"
          />
          <Button asChild>
            <Link href={route('invoices.create')}>+ Add Invoice</Link>
          </Button>
        </div>

        {data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Shipper</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.invoice_number}</TableCell>
                  <TableCell>{inv.type.toUpperCase()}</TableCell>
                  <TableCell>{inv.shipper}</TableCell>
                  <TableCell>{inv.customer}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell className="text-right">
                    ${inv.total_amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={route('invoices.show', inv.id)}>
                      <Edit size={16} title="Preview" />
                    </Link>
                    <Link href={route('invoices.edit', inv.id)}>
                      <Edit size={16} title="Edit" />
                    </Link>
                    <button onClick={() => onDeleteClick(inv.id)} className="text-red-600">
                      <Trash2 size={16} title="Delete" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <TableCaption>No invoices found.</TableCaption>
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="mt-4 flex justify-center space-x-1">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                size="sm"
                variant={meta.current_page === p ? 'default' : 'outline'}
                onClick={() => {
                  router.get(
                    route('invoices.index'),
                    { page: p, search },
                    { preserveState: true, replace: true }
                  );
                }}
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setConfirmOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow">
              <Dialog.Title className="text-lg font-medium">Confirm Deletion</Dialog.Title>
              <p className="mt-2">Are you sure you want to delete this invoice? This cannot be undone.</p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
}
