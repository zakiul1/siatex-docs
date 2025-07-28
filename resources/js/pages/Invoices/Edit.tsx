// resources/js/Pages/Invoices/Edit.tsx

import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Plus, Trash } from 'lucide-react';

type Shipper = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  bank_ids: string[];
  web: string;
};

type Customer = {
  id: number;
  name: string;
  address: string;
  mobile: string;
};

type InvoiceItem = {
  art_num: string;
  description: string;
  size: string;
  hs_code: string;
  qty: number;
  unit_price: number;
  commercial_cost: number;
};

interface PageProps {
  invoice: {
    id: number;
    invoice_no: string;
    type: 'sample' | 'sales';
    shipper_id: number;
    customer_id: number;
    buyer_account?: string;
    shipment_terms?: string;
    courier_name?: string;
    tracking_number?: string;
    issue_date?: string;
    delivery_date?: string;
    payment_mode?: string;
    terms_of_shipment?: string;
    currency?: string;
    discount?: number;
    items: InvoiceItem[];
  };
  shippers: Shipper[];
  customers: Customer[];
}

export default function Edit() {
  const { invoice, shippers, customers } = usePage<{ props: PageProps }>().props;

  const { data, setData, put, processing, errors } = useForm({
    invoice_no:        invoice.invoice_no,
    type:              invoice.type,
    shipper_id:        invoice.shipper_id,
    customer_id:       invoice.customer_id,
    buyer_account:     invoice.buyer_account || '',
    shipment_terms:    invoice.shipment_terms || '',
    courier_name:      invoice.courier_name || '',
    tracking_number:   invoice.tracking_number || '',
    issue_date:        invoice.issue_date || '',
    delivery_date:     invoice.delivery_date || '',
    payment_mode:      invoice.payment_mode || '',
    terms_of_shipment: invoice.terms_of_shipment || '',
    currency:          invoice.currency || 'USD',
    discount:          invoice.discount || 0,
    items: invoice.items.map(i => ({
      art_num:         i.art_num,
      description:     i.description,
      size:            i.size,
      hs_code:         i.hs_code,
      qty:             i.qty,
      unit_price:      i.unit_price,
      commercial_cost: i.commercial_cost || 0,
    })) as InvoiceItem[],
  });

  const addRow = () => {
    setData('items', [
      ...data.items,
      { art_num:'', description:'', size:'', hs_code:'', qty:0, unit_price:0, commercial_cost:0 }
    ]);
  };

  const removeRow = (index: number) => {
    setData('items', data.items.filter((_, i) => i !== index));
  };

  const onItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const items = [...data.items];
    // @ts-ignore
    items[index][field] = value;
    setData('items', items);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('invoices.update', invoice.id));
  };

  const selShipper = shippers.find(s => s.id === Number(data.shipper_id));
  const selCustomer = customers.find(c => c.id === Number(data.customer_id));

  return (
    <AppLayout breadcrumbs={[
      { title: 'Invoices', href: route('invoices.index') },
      { title: `Edit #${invoice.invoice_no}` }
    ]}>
      <Head title={`Edit Invoice ${invoice.invoice_no}`} />

      <form onSubmit={submit} className="p-8 space-y-6">

        {/* Invoice No & Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="invoice_no">Invoice No</Label>
            <Input
              id="invoice_no"
              value={data.invoice_no}
              onChange={e => setData('invoice_no', e.currentTarget.value)}
              required
            />
            {errors.invoice_no && <p className="text-red-600">{errors.invoice_no}</p>}
          </div>
          <div>
            <Label>Type</Label>
            <div className="flex space-x-6">
              {(['sample','sales'] as const).map(type => (
                <div key={type} className="flex items-center">
                  <Input
                    id={`type-${type}`}
                    type="radio"
                    name="type"
                    value={type}
                    checked={data.type === type}
                    onChange={() => setData('type', type)}
                  />
                  <Label htmlFor={`type-${type}`} className="ml-2">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipper & Customer selects */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shipper_id">Shipper</Label>
            <select
              id="shipper_id"
              value={data.shipper_id}
              onChange={e => setData('shipper_id', e.currentTarget.value)}
              className="w-full border px-2 py-1 rounded"
              required
            >
              <option value="">Select Shipper…</option>
              {shippers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.shipper_id && <p className="text-red-600">{errors.shipper_id}</p>}
          </div>

          <div>
            <Label htmlFor="customer_id">Customer</Label>
            <select
              id="customer_id"
              value={data.customer_id}
              onChange={e => setData('customer_id', e.currentTarget.value)}
              className="w-full border px-2 py-1 rounded"
              required
            >
              <option value="">Select Customer…</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.customer_id && <p className="text-red-600">{errors.customer_id}</p>}
          </div>
        </div>

        {/* Shipper Details Panel */}
        {selShipper && (
          <div className="bg-gray-50 p-4 rounded grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold">{selShipper.name}</h3>
              <p>{selShipper.address}</p>
              <p>Phone: {selShipper.phone}</p>
              <p>Email: {selShipper.email}</p>
              <p>Web: {selShipper.web}</p>
            </div>
            <div>
              <h4 className="font-semibold">Bank Accounts</h4>
              <ul className="list-disc pl-5">
                {selShipper.bank_ids.map((b,i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* Customer Details Panel */}
        {selCustomer && (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold">{selCustomer.name}</h3>
            <p>{selCustomer.address}</p>
            <p>Mobile: {selCustomer.mobile}</p>
          </div>
        )}

        {/* Sample‑only fields */}
        {data.type === 'sample' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buyer_account">Buyer Account</Label>
              <Input
                id="buyer_account"
                value={data.buyer_account}
                onChange={e => setData('buyer_account', e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="shipment_terms">Shipment Terms</Label>
              <Input
                id="shipment_terms"
                value={data.shipment_terms}
                onChange={e => setData('shipment_terms', e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="courier_name">Courier Name</Label>
              <Input
                id="courier_name"
                value={data.courier_name}
                onChange={e => setData('courier_name', e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="tracking_number">Tracking #</Label>
              <Input
                id="tracking_number"
                value={data.tracking_number}
                onChange={e => setData('tracking_number', e.currentTarget.value)}
              />
            </div>
          </div>
        )}

        {/* Sales‑only fields */}
        {data.type === 'sales' && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={data.issue_date}
                onChange={e => setData('issue_date', e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="delivery_date">Delivery Date</Label>
              <Input
                id="delivery_date"
                type="date"
                value={data.delivery_date}
                onChange={e => setData('delivery_date', e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="payment_mode">Payment Mode</Label>
              <Input
                id="payment_mode"
                value={data.payment_mode}
                onChange={e => setData('payment_mode', e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="terms_of_shipment">Terms of Shipment</Label>
              <Input
                id="terms_of_shipment"
                value={data.terms_of_shipment}
                onChange={e => setData('terms_of_shipment', e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={data.currency}
                onChange={e => setData('currency', e.currentTarget.value)}
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={data.discount}
                onChange={e => setData('discount', parseFloat(e.currentTarget.value))}
              />
            </div>
          </div>
        )}

        {/* Line items */}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Art Num</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>HS Code</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Unit Price</TableCell>
                {data.type === 'sales' && <TableCell>Commercial Cost</TableCell>}
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Input
                      value={item.art_num}
                      onChange={e => onItemChange(i, 'art_num', e.currentTarget.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={e => onItemChange(i, 'description', e.currentTarget.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.size}
                      onChange={e => onItemChange(i, 'size', e.currentTarget.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.hs_code}
                      onChange={e => onItemChange(i, 'hs_code', e.currentTarget.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={e => onItemChange(i, 'qty', parseFloat(e.currentTarget.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.unit_price}
                      onChange={e => onItemChange(i, 'unit_price', parseFloat(e.currentTarget.value))}
                    />
                  </TableCell>
                  {data.type === 'sales' && (
                    <TableCell>
                      <Input
                        type="number"
                        value={item.commercial_cost}
                        onChange={e => onItemChange(i, 'commercial_cost', parseFloat(e.currentTarget.value))}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => removeRow(i)}>
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="secondary" size="sm" onClick={addRow}>
            <Plus size={16} /> Add Row
          </Button>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={processing}>Update Invoice</Button>
          <Link href={route('invoices.index')}>
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>

      </form>
    </AppLayout>
  );
}
