// resources/js/Pages/SampleInvoices/Show.tsx

import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { route } from 'ziggy-js';

export default function Show() {
  const { invoice } = usePage<{ invoice:any }>().props;

  // ensure numbers
  const items = (invoice.items || []).map(i => ({
    ...i,
    qty: Number(i.qty)||0,
    unit_price: Number(i.unit_price)||0,
  }));
  const total = items.reduce((sum,i) => sum + i.qty*i.unit_price, 0);

  return (
    <AppLayout breadcrumbs={[
      { title:'Sample Invoices', href:route('sample-invoices.index')},
      { title:`#${invoice.invoice_no}`}
    ]}>
      <Head title={`Invoice ${invoice.invoice_no}`} />

      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{invoice.shipper.name}</h2>
            <p>{invoice.shipper.address}</p>
            <p>{invoice.shipper.phone}</p>
            <p>{invoice.shipper.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">INVOICE No.</label>
            <input
              type="text"
              readOnly
              value={invoice.invoice_no}
              className="border px-2 py-1 bg-gray-100 text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="border p-4">
            <h3 className="font-semibold bg-gray-100 p-1">Details:</h3>
            <div className="mt-2 space-y-1">
              <div><strong>Date:</strong> {invoice.date}</div>
              <div><strong>Buyer Account:</strong> {invoice.buyer_account}</div>
              <div><strong>Shipment Terms:</strong> {invoice.shipment_terms}</div>
              <div><strong>Courier Name:</strong> {invoice.courier_name}</div>
              <div><strong>Tracking Number:</strong> {invoice.tracking_number}</div>
            </div>
          </div>
          <div className="border p-4">
            <h3 className="font-semibold bg-gray-100 p-1">Receiver:</h3>
            <div className="mt-2">
              <p className="font-semibold">{invoice.customer.name}</p>
              <p>{invoice.customer.address}</p>
              <p>Attention: {invoice.customer.contact_name}</p>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Art Num</TableCell>
              <TableCell>Article Description</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>HS Code</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Sub Total</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((i, idx) => (
              <TableRow key={idx}>
                <TableCell>{i.art_num}</TableCell>
                <TableCell>{i.description}</TableCell>
                <TableCell>{i.size}</TableCell>
                <TableCell>{i.hs_code}</TableCell>
                <TableCell>{i.qty}</TableCell>
                <TableCell>${i.unit_price.toFixed(2)}</TableCell>
                <TableCell>${(i.qty*i.unit_price).toFixed(2)}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={6} className="text-right font-bold">Total:</TableCell>
              <TableCell className="font-bold">${total.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-4 whitespace-pre-line">
          {invoice.footnotes}
        </div>

        <div className="mt-6 flex space-x-2">
          <Link href={route('sample-invoices.create')}>
            <Button>New Sample Invoice</Button>
          </Link>
          <Link href={route('sample-invoices.edit', invoice.id)}>
            <Button>Edit Sample Invoice</Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
