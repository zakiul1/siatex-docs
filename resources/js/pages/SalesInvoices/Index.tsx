// resources/js/Pages/SalesInvoices/Index.tsx
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
import { Eye, Edit2, Trash2, Download } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'sonner';

type Invoice = {
  id: number;
  invoice_no: string;
  type: string;
  shipper: { name: string };
  customer: { name: string };
  issue_date: string;
  items: { qty: number; unit_price: number }[]; // now always provided
};

export default function Index() {
  const { invoices, toastData, filters } = usePage<{
    invoices: {
      data: Invoice[];
      current_page: number;
      last_page: number;
    };
    toastData?: { title: string; message: string; type: 'success' | 'error' };
    filters: { search?: string };
  }>().props;

  const [search, setSearch] = useState(filters.search || '');
  const debounce = useRef<number>();

  useEffect(() => {
    if (toastData) {
      toast(toastData.title, {
        description: toastData.message,
        type: toastData.type,
      });
    }
  }, [toastData]);

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      router.get(
        route('sales-invoices.index'),
        { search },
        { preserveState: true, replace: true }
      );
    }, 500);
    return () => clearTimeout(debounce.current);
  }, [search]);

  const { data, current_page, last_page } = invoices;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const onDeleteClick = (id: number) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };
  const handleDelete = () => {
    router.delete(route('sales-invoices.destroy', confirmId!));
    setConfirmOpen(false);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Sales Invoices', href: route('sales-invoices.index') },
      ]}
    >
      <Head title="Sales Invoices" />

      <div className="p-8">
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search by invoice no…"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="max-w-sm"
          />
          <Button asChild>
            <Link href={route('sales-invoices.create')}>+ New Invoice</Link>
          </Button>
        </div>

        {data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Invoice No</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Shipper</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((inv) => {
                // always reduce items to compute total
                const total = inv.items.reduce(
                  (sum, it) => sum + it.qty * it.unit_price,
                  0
                );

                return (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.id}</TableCell>
                    <TableCell>{inv.invoice_no}</TableCell>
                    <TableCell>{inv.type}</TableCell>
                    <TableCell>{inv.shipper.name}</TableCell>
                    <TableCell>{inv.customer.name}</TableCell>
                    <TableCell>{formatDate(inv.issue_date)}</TableCell>
                    <TableCell className="text-right">
                      ${total.toFixed(2)}
                    </TableCell>
                    <TableCell className="flex justify-end items-center space-x-4">
                   
                      <a
                        href={route('sales-invoices.download', inv.id)}
                        title="Download PDF"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-600"
                      >
                        <Download size={16} />
                      </a>
                      <Link
                        href={route('sales-invoices.edit', inv.id)}
                        title="Edit"
                        className="hover:text-yellow-600"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(inv.id)}
                        className="hover:text-red-800 text-red-600 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <TableCaption>No sales invoices found.</TableCaption>
        )}

        {last_page > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            {Array.from({ length: last_page }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={current_page === p ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  router.get(
                    route('sales-invoices.index'),
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

        <Transition appear show={confirmOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setConfirmOpen(false)}
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded shadow-lg">
                <Dialog.Title className="text-lg font-medium">
                  Confirm Deletion
                </Dialog.Title>
                <p className="mt-2">This cannot be undone.</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </div>
    </AppLayout>
  );
}
