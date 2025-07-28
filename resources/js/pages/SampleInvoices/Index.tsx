// resources/js/Pages/SampleInvoices/Index.tsx

import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Plus, Edit, Eye, Trash2, Download } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { route } from 'ziggy-js';

interface Invoice {
  id: number;
  invoice_no: string;
  shipper: { name: string };
  customer: { name: string };
  date: string;
}

interface Props {
  invoices: {
    data: Invoice[];
    current_page: number;
    last_page: number;
  };
  filters: { search?: string };
}

export default function Index() {
  const { invoices, filters } = usePage<Props>().props;
  const [search, setSearch] = useState(filters.search || '');
  const debounce = useRef<number>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // debounce search
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => {
      router.get(
        route('sample-invoices.index'),
        { search },
        { replace: true, preserveState: true }
      );
    }, 300);
    return () => clearTimeout(debounce.current);
  }, [search]);

  const onDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const handleDelete = () => {
    if (deleteId) {
      router.delete(route('sample-invoices.destroy', deleteId));
      setConfirmOpen(false);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Sample Invoices' }]}>
      <Head title="Sample Invoices" />

      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between gap-6">
      
          <Input
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
                  />
                      <Link href={route('sample-invoices.create')}>
            <Button><Plus size={16}/> Add Invoice</Button>
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Invoice No</TableCell>
                <TableCell>Shipper</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.data.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.invoice_no}</TableCell>
                  <TableCell>{inv.shipper.name}</TableCell>
                  <TableCell>{inv.customer.name}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell className="flex justify-end space-x-2">
                    <Link href={route('sample-invoices.show', inv.id)}>
                      <Eye size={16}/>
                    </Link>
                    <Link href={route('sample-invoices.edit', inv.id)}>
                      <Edit size={16}/>
                    </Link>
                  <button
  type="button"
  onClick={() => {
    // full page navigation to the PDF endpoint
    window.location.href = route('sample-invoices.download', inv.id)
  }}
  className="text-gray-600 hover:text-gray-800 cursor-pointer"
>
  <Download size={16} />
</button>

                    <button onClick={() => onDelete(inv.id)}>
                      <Trash2 size={16}/>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* pagination */}
        {invoices.last_page > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: invoices.last_page }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                size="sm"
                variant={p === invoices.current_page ? 'default' : 'outline'}
                onClick={() =>
                  router.get(
                    route('sample-invoices.index'),
                    { page: p, search },
                    { replace: true, preserveState: true }
                  )
                }
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* delete confirmation */}
      <Transition appear show={confirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setConfirmOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow">
                  <Dialog.Title className="text-lg font-medium">Delete Invoice?</Dialog.Title>
                  <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
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
