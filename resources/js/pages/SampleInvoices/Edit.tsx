// resources/js/Pages/SampleInvoices/Edit.tsx

import React, { useMemo } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Plus, Trash2, FileText } from 'lucide-react';

type Shipper = { id: number; name: string; address: string; phone: string; email: string; bank_ids: string[] };
type Customer = { id: number; name: string; address: string; mobile: string; contact_name?: string };
type Item = { art_num: string; description: string; size: string; hs_code: string; qty: number; unit_price: number };

interface PageProps {
  invoice: {
    id: number;
    invoice_no: string;
    shipper_id: number;
    customer_id: number;
    date: string;
    buyer_account: string;
    shipment_terms: 'Collect' | 'Prepaid';
    courier_name: string;
    tracking_number: string;
    footnotes: string;
    items: Item[];
  };
  shippers: Shipper[];
  customers: Customer[];
}

export default function Edit() {
  const { invoice, shippers, customers } = usePage<{ props: PageProps }>().props;

  const { data, setData, put, processing, errors } = useForm({
    shipper_id:      invoice.shipper_id,
    customer_id:     invoice.customer_id,
    date:            invoice.date,
    buyer_account:   invoice.buyer_account,
    shipment_terms:  invoice.shipment_terms,
    courier_name:    invoice.courier_name,
    tracking_number: invoice.tracking_number,
    items:           invoice.items.map(i => ({ ...i })),
    footnotes:       invoice.footnotes,
  });

  const selCustomer = useMemo(
    () => customers.find(c => c.id === Number(data.customer_id)),
    [data.customer_id]
  );

  const addRow = () =>
    setData('items', [
      ...data.items,
      { art_num:'', description:'', size:'', hs_code:'', qty:0, unit_price:0 },
    ]);

  const removeRow = (i: number) =>
    setData('items', data.items.filter((_, idx) => idx !== i));

  const onItemChange = (i: number, field: keyof Item, value: any) => {
    const items = [...data.items];
    items[i][field] = field === 'qty' || field === 'unit_price' ? Number(value) : value;
    setData('items', items);
  };

  const total = useMemo(
    () => data.items.reduce((sum, itm) => sum + itm.qty * itm.unit_price, 0),
    [data.items]
  );

  const preview = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('sample-invoices.preview'), { preserveState: true });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('sample-invoices.update', invoice.id));
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'Sample Invoices', href: route('sample-invoices.index') },
      { title: `Edit #${invoice.invoice_no}` },
    ]}>
      <Head title={`Edit Sample Invoice ${invoice.invoice_no}`} />

      <form onSubmit={submit} className="p-8 space-y-6">

        {/* Top row: shipper info & invoice no */}
        <div className="grid grid-cols-2 gap-6">
          <div className="border p-4">
            <h3 className="font-bold">
              {shippers.find(s => s.id === data.shipper_id)?.name}
            </h3>
            <p className="whitespace-pre-line">
              {shippers.find(s => s.id === data.shipper_id)?.address}
            </p>
            <p>Phone: {shippers.find(s => s.id === data.shipper_id)?.phone}</p>
            <p>Email: {shippers.find(s => s.id === data.shipper_id)?.email}</p>
            <h4 className="mt-2 font-semibold">Bank Accounts:</h4>
            <ul className="list-disc list-inside">
              {shippers
                .find(s => s.id === data.shipper_id)
                ?.bank_ids.map((b,i)=>(<li key={i}>{b}</li>))}
            </ul>
          </div>
          <div className="flex justify-end">
            <div>
              <label className="block mb-1 font-medium text-sm">INVOICE No.</label>
              <Input
                readOnly
                value={invoice.invoice_no}
                className="bg-gray-100 text-right"
              />
            </div>
          </div>
        </div>

        {/* Shipper & Customer selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Shipper</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={data.shipper_id}
              onChange={e=>setData('shipper_id',e.currentTarget.value)}
              required
            >
              <option value="">Select Shipper…</option>
              {shippers.map(s=>(<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
            {errors.shipper_id&&<p className="text-red-600">{errors.shipper_id}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Customer</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={data.customer_id}
              onChange={e=>setData('customer_id',e.currentTarget.value)}
              required
            >
              <option value="">Select Customer…</option>
              {customers.map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
            {errors.customer_id&&<p className="text-red-600">{errors.customer_id}</p>}
          </div>
        </div>

        {/* Details & Receiver side-by-side */}
        <div className="grid grid-cols-2 gap-6">
          {/* Details Panel */}
          <div className="border p-4">
            <h3 className="bg-gray-100 px-2 py-1 font-medium">Details:</h3>
            <div className="mt-2 space-y-2">
              <div>
                <label className="block mb-1">Date</label>
                <Input
                  type="date"
                  value={data.date}
                  onChange={e=>setData('date',e.currentTarget.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Buyer Account</label>
                <Input
                  value={data.buyer_account}
                  onChange={e=>setData('buyer_account',e.currentTarget.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Shipment Terms</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={data.shipment_terms}
                  onChange={e=>setData('shipment_terms',e.currentTarget.value as any)}
                >
                  <option>Collect</option>
                  <option>Prepaid</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Courier Name</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={data.courier_name}
                  onChange={e=>setData('courier_name',e.currentTarget.value)}
                >
                  <option value="">Select One</option>
                  <option>DHL</option>
                  <option>Aramex</option>
                  <option>FedEx</option>
                  <option>UPS</option>
                  <option>World Bridge/DHLa</option>
                  <option>FDP</option>
                  <option>TNT</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Tracking Number</label>
                <Input
                  value={data.tracking_number}
                  onChange={e=>setData('tracking_number',e.currentTarget.value)}
                />
              </div>
            </div>
          </div>

          {/* Receiver Panel */}
          <div className="border p-4">
            <h3 className="bg-gray-100 px-2 py-1 font-medium">Receiver:</h3>
            {selCustomer ? (
              <div className="mt-2 space-y-1">
                <p className="font-semibold">{selCustomer.name}</p>
                <p className="whitespace-pre-line">{selCustomer.address}</p>
                {selCustomer.mobile && <p>Mobile: {selCustomer.mobile}</p>}
                {selCustomer.contact_name && <p>Attention: {selCustomer.contact_name}</p>}
              </div>
            ) : (
              <p className="mt-2 italic text-sm text-gray-500">
                Select a customer to see details
              </p>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableCell>Art Num</TableCell>
                <TableCell>ARTICLE DESCRIPTION</TableCell>
                <TableCell>SIZE</TableCell>
                <TableCell>HS CODE</TableCell>
                <TableCell>QTY</TableCell>
                <TableCell>UNIT PRICE</TableCell>
                <TableCell>SUB TOTAL</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((itm,i)=>(<TableRow key={i}>
                <TableCell>
                  <Input value={itm.art_num}
                    onChange={e=>onItemChange(i,'art_num',e.currentTarget.value)}/>
                </TableCell>
                <TableCell>
                  <Input value={itm.description}
                    onChange={e=>onItemChange(i,'description',e.currentTarget.value)}/>
                </TableCell>
                <TableCell>
                  <Input value={itm.size}
                    onChange={e=>onItemChange(i,'size',e.currentTarget.value)}/>
                </TableCell>
                <TableCell>
                  <Input value={itm.hs_code}
                    onChange={e=>onItemChange(i,'hs_code',e.currentTarget.value)}/>
                </TableCell>
                <TableCell>
                  <Input type="number" value={itm.qty}
                    onChange={e=>onItemChange(i,'qty',e.currentTarget.value)}/>
                </TableCell>
                <TableCell>
                  <Input type="number" value={itm.unit_price}
                    onChange={e=>onItemChange(i,'unit_price',e.currentTarget.value)}/>
                </TableCell>
                <TableCell>
                  <Input readOnly value={(itm.qty*itm.unit_price).toFixed(2)}/>
                </TableCell>
                <TableCell>
                  <Button type="button" variant="destructive" size="sm"
                    onClick={()=>removeRow(i)}>
                    <Trash2 size={16}/>
                  </Button>
                </TableCell>
              </TableRow>))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-2">
            <Button type="button" variant="secondary" size="sm" onClick={addRow}>
              <Plus size={16}/> More
            </Button>
            <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
          </div>
        </div>

        {/* Footnotes */}
        <div>
          <Textarea rows={3}
            value={data.footnotes}
            onChange={e=>setData('footnotes',e.currentTarget.value)}/>
        </div> 

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button type="button" onClick={preview} disabled={processing}>
            <FileText size={16} className="mr-2"/> See Preview
          </Button>
          <Button type="submit" disabled={processing}>Save Invoice</Button>
        </div>
      </form>
    </AppLayout>
  );
}
