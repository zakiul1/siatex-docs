import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';

export default function Preview() {
  const { invoice } = usePage<{ invoice: any }>().props;

  return (
    <AppLayout>
      <Head title="Preview Invoice" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Preview {invoice.type} Invoice</h1>
        <div className="space-x-2">
          <Link href={route('invoices.create', { type: invoice.type })}>
            <Button>New {invoice.type}</Button>
          </Link>
          <Link href={route('invoices.edit', invoice.id)}>
            <Button>Edit {invoice.type}</Button>
          </Link>
        </div>
      </div>

      <div className="border p-4 bg-white">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="font-bold">{invoice.shipper.name}</h2>
            {/* you can render full shipper address fields here */}
          </div>
          <div>
            <label className="block text-sm">Invoice No.</label>
            <input
              readOnly
              value={invoice.invoice_number}
              className="border-gray-300 rounded-md p-1 w-32 text-right"
            />
          </div>
        </div>

        <div className="flex mb-4 space-x-4">
          <div className="flex-1 border bg-gray-50 p-2">
            <h3 className="font-medium mb-2">Details:</h3>
            <p>Date: {new Date(invoice.created_at).toLocaleDateString()}</p>
            <p>Buyer Account: {invoice.buyer_account}</p>
            <p>Shipment Terms: {invoice.shipment_terms}</p>
            <p>Courier Name: {invoice.courier_name}</p>
            <p>Tracking No.: {invoice.tracking_number}</p>
          </div>
          <div className="flex-1 border bg-gray-50 p-2">
            <h3 className="font-medium mb-2">Receiver:</h3>
            <h4 className="font-semibold">{invoice.customer.name}</h4>
            {/* render full customer address */}
          </div>
        </div>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>Art Num</th>
              <th>Description</th>
              <th>Size</th>
              <th>HS Code</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Sub Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it: any) => (
              <tr key={it.id}>
                <td className="px-2">{it.art_num}</td>
                <td className="px-2">{it.description}</td>
                <td className="px-2">{it.size}</td>
                <td className="px-2">{it.hs_code}</td>
                <td className="px-2">{it.quantity}</td>
                <td className="px-2">{it.unit_price.toFixed(2)}</td>
                <td className="px-2">{it.sub_total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="text-right pr-4 font-medium">Total:</td>
              <td className="px-2 font-semibold">
                {invoice.total_price.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        {invoice.notes && (
          <div className="mt-4">
            <h3 className="font-medium">Notes:</h3>
            <p>{invoice.notes}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
