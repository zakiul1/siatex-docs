// resources/js/Pages/Invoices/Show.tsx

import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { route } from 'ziggy-js';

export default function Show() {
  const { invoice } = usePage<{ invoice: any }>().props;

  // Ensure numeric values so toFixed() doesn't throw
  const items = (invoice.items as any[]).map(i => ({
    ...i,
    qty: Number(i.qty) || 0,
    unit_price: Number(i.unit_price) || 0,
    commercial_cost: Number(i.commercial_cost) || 0,
    id: i.id,
  }));
  const total = items.reduce((sum, i) => sum + i.qty * i.unit_price, 0);

  return (
    <AppLayout breadcrumbs={[
      { title: 'Invoices', href: route('invoices.index') },
      { title: `#${invoice.invoice_no}` },
    ]}>
      <Head title={`Invoice ${invoice.invoice_no}`} />

      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Invoice {invoice.invoice_no}</h1>
          <Link href={route('invoices.edit', invoice.id)}>
            <Button>Edit</Button>
          </Link>
        </div>

        {/* Shipper & Customer Panels */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="font-bold">{invoice.shipper.name}</h2>
            <p>{invoice.shipper.address}</p>
            <p>{invoice.shipper.phone}</p>
            <p>{invoice.shipper.email}</p>
          </div>
          <div>
            <h2 className="font-bold">Customer</h2>
            <p>{invoice.customer.name}</p>
            <p>{invoice.customer.address}</p>
            <p>{invoice.customer.mobile}</p>
          </div>
        </div>

        {/* Sample vs Sales Details */}
        {invoice.type === 'sample' && (
          <div className="grid grid-cols-2 gap-4">
            <div><strong>Buyer Account:</strong> {invoice.buyer_account}</div>
            <div><strong>Shipment Terms:</strong> {invoice.shipment_terms}</div>
            <div><strong>Courier:</strong> {invoice.courier_name}</div>
            <div><strong>Tracking #:</strong> {invoice.tracking_number}</div>
          </div>
        )}

        {invoice.type === 'sales' && (
          <div className="grid grid-cols-4 gap-4">
            <div><strong>Issue Date:</strong> {invoice.issue_date}</div>
            <div><strong>Delivery Date:</strong> {invoice.delivery_date}</div>
            <div><strong>Payment Mode:</strong> {invoice.payment_mode}</div>
            <div><strong>Terms:</strong> {invoice.terms_of_shipment}</div>
            <div><strong>Currency:</strong> {invoice.currency}</div>
            <div><strong>Discount:</strong> {invoice.discount || 0}%</div>
          </div>
        )}

        {/* Line Items Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Art Num</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>HS Code</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit Price</TableCell>
              {invoice.type === 'sales' && <TableCell>Commercial Cost</TableCell>}
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(i => (
              <TableRow key={i.id}>
                <TableCell>{i.art_num}</TableCell>
                <TableCell>{i.description}</TableCell>
                <TableCell>{i.size}</TableCell>
                <TableCell>{i.hs_code}</TableCell>
                <TableCell>{i.qty}</TableCell>
                <TableCell>${i.unit_price.toFixed(2)}</TableCell>
                {invoice.type === 'sales' && (
                  <TableCell>${i.commercial_cost.toFixed(2)}</TableCell>
                )}
                <TableCell>${(i.qty * i.unit_price).toFixed(2)}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell
                colSpan={invoice.type === 'sales' ? 7 : 6}
                className="text-right font-bold"
              >
                Total:
              </TableCell>
              <TableCell className="font-bold">${total.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
