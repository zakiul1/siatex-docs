import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type Item = {
  art_num?: string;
  description: string;
  size?: string;
  hs_code?: string;
  quantity: number;
  unit_price: number;
};

export default function Form({
  invoice,
  shippers,
  customers,
  type,
  method,
  action,
}: {
  invoice?: any;
  shippers: any[];
  customers: any[];
  type: 'sample' | 'sales';
  method: 'post' | 'put';
  action: string;
}) {
  const isEdit = Boolean(invoice);
  const { data, setData, post, put, processing, errors } = useForm({
    type,
    shipper_id: invoice?.shipper_id || '',
    customer_id: invoice?.customer_id || '',
    buyer_account: invoice?.buyer_account || '',
    shipment_terms: invoice?.shipment_terms || 'Collect',
    courier_name: invoice?.courier_name || '',
    tracking_number: invoice?.tracking_number || '',
    notes: invoice?.notes || '',
    items: invoice
      ? invoice.items.map((it: any) => ({ ...it }))
      : [{ description: '', quantity: 1, unit_price: 0 }],
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fn = method === 'post' ? post : put;
    fn(action, { data });
  };

  // recalc sub_totals & total_price
  useEffect(() => {
    const items = [...data.items].map(it => ({
      ...it,
      sub_total: it.quantity * it.unit_price,
    }));
    setData('items', items);
    const total = items.reduce((sum, it) => sum + it.sub_total, 0);
    setData('total_price', total);
  }, [data.items]);

  const addRow = () => {
    setData('items', [...data.items, {
      description: '', quantity: 1, unit_price: 0
    }]);
  };

  const removeRow = (index: number) => {
    const items = [...data.items];
    items.splice(index,1);
    setData('items', items);
  };

  return (
    <form onSubmit={submit}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          {isEdit ? `Edit ${type}` : `Create ${type}`} Invoice
        </h1>
        <Input
          label="Invoice No."
          value={invoice?.invoice_number || '…'}
          readOnly
          className="w-32"
        />
      </div>

      {/* Top panels */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Shipper info */}
        <div>
          <label className="block font-medium">Shipper</label>
          <select
            value={data.shipper_id}
            onChange={e => setData('shipper_id', e.target.value)}
            className="block w-full border-gray-300 rounded-md"
            required
          >
            <option value="">Select Shipper</option>
            {shippers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {/* you can render address fields here if needed */}
        </div>

        {/* Details panel */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="p-4 border bg-gray-50">
            <h2 className="font-medium mb-2">Details:</h2>
            <Input
              label="Buyer Account"
              value={data.buyer_account}
              onChange={e => setData('buyer_account', e.target.value)}
            />
            <Select
              label="Shipment Terms"
              value={data.shipment_terms}
              onChange={e => setData('shipment_terms', e.target.value)}
              options={[
                { value:'Collect', label:'Collect' },
                { value:'Prepaid', label:'Prepaid' },
              ]}
            />
            <Select
              label="Courier Name"
              value={data.courier_name}
              onChange={e => setData('courier_name', e.target.value)}
              options={[{value:'',label:'Select One'}, /* add your names */]}
            />
            <Input
              label="Tracking Number"
              value={data.tracking_number}
              onChange={e => setData('tracking_number', e.target.value)}
            />
          </div>

          {/* Receiver */}
          <div className="p-4 border bg-gray-50">
            <h2 className="font-medium mb-2">Receiver:</h2>
            <select
              value={data.customer_id}
              onChange={e => setData('customer_id', e.target.value)}
              className="block w-full border-gray-300 rounded-md mb-2"
              required
            >
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {/* here render full customer address if desired */}
          </div>
        </div>
      </div>

      {/* Items table */}
      <table className="w-full mb-4 border">
        <thead className="bg-gray-100">
          <tr>
            <th>Art Num</th>
            <th>Description</th>
            <th>Size</th>
            <th>HS Code</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Sub Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((it: Item & any, idx: number) => (
            <tr key={idx}>
              <td>
                <Input
                  value={it.art_num}
                  onChange={e => {
                    const v=e.target.value;
                    setData(`items.${idx}.art_num`, v);
                  }}
                />
              </td>
              <td>
                <Input
                  value={it.description}
                  onChange={e => {
                    const v=e.target.value;
                    setData(`items.${idx}.description`, v);
                  }}
                  required
                />
              </td>
              <td>
                <Input
                  value={it.size}
                  onChange={e => setData(`items.${idx}.size`, e.target.value)}
                />
              </td>
              <td>
                <Input
                  value={it.hs_code}
                  onChange={e => setData(`items.${idx}.hs_code`, e.target.value)}
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={it.quantity}
                  onChange={e => setData(`items.${idx}.quantity`, Number(e.target.value))}
                  required
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={it.unit_price}
                  onChange={e => setData(`items.${idx}.unit_price`, Number(e.target.value))}
                  required
                />
              </td>
              <td>
                <Input value={it.sub_total.toFixed(2)} readOnly />
              </td>
              <td>
                <Button
                  variant="destructive"
                  onClick={() => removeRow(idx)}
                >×</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6} className="text-right pr-4 font-medium">Total:</td>
            <td colSpan={2}>
              <Input value={data.items.reduce((s: number, it:any) => s + it.sub_total,0).toFixed(2)} readOnly />
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="flex justify-between mb-4">
        <Button onClick={addRow}>+ More</Button>
        <Textarea
          label="Notes"
          value={data.notes}
          onChange={e => setData('notes', e.target.value)}
        />
      </div>

      <div className="text-right">
        <Button type="submit" disabled={processing}>
          {isEdit ? 'Update' : 'See Preview'}
        </Button>
      </div>
    </form>
  );
}
