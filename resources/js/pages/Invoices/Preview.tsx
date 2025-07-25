// resources/js/Pages/Invoices/Preview.tsx
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';

export default function Preview() {
  const { invoice } = usePage<{ invoice: any }>().props;
  const isSales = invoice.type === 'sales';

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Invoices', href: route('invoices.index') },
        { title: 'Preview', href: '#' },
      ]}
    >
      <Head title="Invoice Preview" />

      <div className="p-6 bg-white rounded shadow space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            {isSales ? 'Sales Invoice' : 'Sample Invoice'}
          </h1>
          <div className="space-x-2">
            <Button asChild size="sm">
              <Link href={route('invoices.create')}>+ New Invoice</Link>
            </Button>
            {invoice.id && (
              <Button asChild size="sm">
                <Link href={route('invoices.edit', invoice.id)}>Edit This</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-bold">{invoice.shipper.name}</h2>
            <p>{invoice.shipper.address}</p>
            {/* …phone, email, etc if available */}
          </div>
          <div className="text-right">
            <div className="font-medium">INVOICE No.</div>
            <div className="mt-1 inline-block bg-gray-200 px-3 py-1 rounded">
              {invoice.invoice_number}
            </div>
          </div>
        </div>

        {/* Details vs Dates */}
        {isSales ? (
          <table className="w-full border mb-4">
            <thead className="bg-gray-100">
              <tr>
                {['Issue Date','Delivery Date','Payment Mode','Terms','Currency'].map(h => (
                  <th key={h} className="px-2 py-1 border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 border">{invoice.issue_date}</td>
                <td className="px-2 py-1 border">{invoice.delivery_date}</td>
                <td className="px-2 py-1 border">{invoice.payment_mode}</td>
                <td className="px-2 py-1 border">{invoice.terms_of_shipment}</td>
                <td className="px-2 py-1 border">{invoice.currency}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border p-2">
              <h3 className="font-medium">Details</h3>
              <p>Date: {invoice.issue_date}</p>
              <p>Buyer Acct: {invoice.buyer_account}</p>
              <p>Shipment Terms: {invoice.shipment_terms}</p>
              <p>Courier: {invoice.courier_name}</p>
              <p>Tracking #: {invoice.tracking_number}</p>
            </div>
            <div className="border p-2">
              <h3 className="font-medium">Receiver</h3>
              <p>{invoice.customer.name}</p>
              <p>{invoice.customer.address}</p>
              {/* …attention, etc */}
            </div>
          </div>
        )}

        {/* Line Items */}
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              {[
                'Art Num','Description','Size',
                isSales ? 'Qty' : 'HS Code',
                'Unit Price','Sub‑Total'
              ].map(h => (
                <th key={h} className="px-2 py-1 border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it:any, idx:number) => (
              <tr key={idx}>
                <td className="px-2 py-1 border">{it.art_num}</td>
                <td className="px-2 py-1 border">{it.description}</td>
                <td className="px-2 py-1 border">{it.size}</td>
                <td className="px-2 py-1 border">
                  {isSales ? it.quantity : it.hs_code}
                </td>
                <td className="px-2 py-1 border">
                  ${it.unit_price.toFixed(2)}
                </td>
                <td className="px-2 py-1 border">
                  ${it.sub_total.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={isSales ? 4 : 5} className="px-2 py-1 text-right font-semibold border">
                Total:
              </td>
              <td className="px-2 py-1 font-semibold border">
                ${invoice.total_amount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Notes */}
        <div>
          <h3 className="font-medium">Terms &amp; Remarks</h3>
          <p className="mt-1 whitespace-pre-line">{invoice.notes}</p>
        </div>
      </div>
    </AppLayout>
  );
}
