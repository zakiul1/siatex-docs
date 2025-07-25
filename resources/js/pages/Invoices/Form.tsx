// resources/js/Pages/Invoices/Form.tsx
import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

type Props = {
  invoice: any;      // null when creating
  shippers: { id:number; name:string }[];
  customers: { id:number; name:string }[];
};

export default function Form({ invoice, shippers, customers }: Props) {
  const isEdit = Boolean(invoice);

  const form = useForm({
    type:             invoice?.type            || 'sample',
    shipper_id:       invoice?.shipper_id      || '',
    customer_id:      invoice?.customer_id     || '',
    buyer_account:    invoice?.buyer_account   || '',
    shipment_terms:   invoice?.shipment_terms  || '',
    courier_name:     invoice?.courier_name    || '',
    tracking_number:  invoice?.tracking_number || '',
    notes:            invoice?.notes           || '',
    issue_date:       invoice?.issue_date      || '',
    delivery_date:    invoice?.delivery_date   || '',
    payment_mode:     invoice?.payment_mode    || '',
    terms_of_shipment:invoice?.terms_of_shipment|| '',
    currency:         invoice?.currency        || '',
    commercial_cost:  invoice?.commercial_cost || 0,
    discount:         invoice?.discount        || 0,
    fob_or_cif:       invoice?.fob_or_cif      || 'fob',
    items:            invoice?.items.map((i:any) => ({
                         art_num:    i.art_num,
                         description:i.description,
                         size:       i.size,
                         hs_code:    i.hs_code,
                         quantity:   i.quantity,
                         unit_price: i.unit_price,
                         sub_total:  i.sub_total,
                       })) || [{
                         art_num:'', description:'', size:'', hs_code:'',
                         quantity:1, unit_price:0, sub_total:0
                       }],
  });

  // Add/remove line items
  function addItem() {
    form.setData('items', [
      ...form.data.items,
      { art_num:'', description:'', size:'', hs_code:'', quantity:1, unit_price:0, sub_total:0 }
    ]);
  }
  function removeItem(i:number) {
    form.setData('items', form.data.items.filter((_:any, idx:number) => idx !== i));
  }
  function updateItem(i:number, field:string, value:any) {
    const items = [...form.data.items];
    items[i][field] = value;
    items[i].sub_total = items[i].quantity * items[i].unit_price;
    form.setData('items', items);
  }

  // Submit vs Preview
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const method = isEdit ? form.put : form.post;
    method(route(isEdit ? 'invoices.update' : 'invoices.store', isEdit ? invoice.id : undefined));
  }
  function handlePreview(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('invoices.preview'), { preserveState: true });
  }

  // scroll to top on errors
  useEffect(() => {
    if (Object.keys(form.errors).length) window.scrollTo(0, 0);
  }, [form.errors]);

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Invoices', href: route('invoices.index') },
        { title: isEdit ? 'Edit' : 'Create', href: isEdit
            ? route('invoices.edit', invoice.id)
            : route('invoices.create')
        },
      ]}
    >
      <Head title={isEdit ? 'Edit Invoice' : 'Create Invoice'} />

      <div className="p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">
          {isEdit ? 'Edit Invoice' : 'Create Invoice'}
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Type */}
          <div>
            <Label>Type</Label>
            <select
              value={form.data.type}
              onChange={e => form.setData('type', e.target.value)}
              className="mt-1 block w-40 border rounded px-2 py-1"
            >
              <option value="sample">Sample</option>
              <option value="sales">Sales</option>
            </select>
            <InputError message={form.errors.type} />
          </div>

          {/* Shipper & Customer */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ['shipper_id','Shipper', shippers],
              ['customer_id','Customer', customers],
            ].map(([key,label,list]:any) => (
              <div key={key}>
                <Label>{label}</Label>
                <select
                  value={(form.data as any)[key]}
                  onChange={e => form.setData(key, e.currentTarget.value)}
                  className="mt-1 block w-full border rounded px-2 py-1"
                >
                  <option value="">– Select –</option>
                  {list.map((x:any) => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>
                <InputError message={(form.errors as any)[key]} />
              </div>
            ))}
          </div>

          {/* Common fields */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ['buyer_account','Buyer Account'],
              ['shipment_terms','Shipment Terms'],
              ['courier_name','Courier Name'],
              ['tracking_number','Tracking #'],
            ].map(([key,label]:any) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  value={(form.data as any)[key]}
                  onChange={e => form.setData(key, e.currentTarget.value)}
                  className="mt-1 w-full"
                />
                <InputError message={(form.errors as any)[key]} />
              </div>
            ))}
          </div>

          {/* Sales‑only */}
          {form.data.type === 'sales' && (
            <div className="grid grid-cols-3 gap-4 border-t pt-4">
              {[
                ['issue_date','Issue Date','date'],
                ['delivery_date','Delivery Date','date'],
                ['payment_mode','Payment Mode','text'],
                ['terms_of_shipment','Terms of Shipment','text'],
                ['currency','Currency','text'],
                ['commercial_cost','Commercial Cost','number'],
                ['discount','Discount','number'],
              ].map(([key,label,type]:any) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <Input
                    type={type}
                    value={(form.data as any)[key]}
                    onChange={e => form.setData(key, e.currentTarget.value)}
                    className="mt-1 w-full"
                  />
                  <InputError message={(form.errors as any)[key]} />
                </div>
              ))}

              {/* FOB/CIF */}
              <div className="col-span-3 mt-2">
                <Label>Terms (FOB / CIF)</Label>
                <div className="space-x-4 mt-1">
                  <label>
                    <input
                      type="radio"
                      checked={form.data.fob_or_cif === 'fob'}
                      onChange={() => form.setData('fob_or_cif','fob')}
                    /> FOB
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={form.data.fob_or_cif === 'cif'}
                      onChange={() => form.setData('fob_or_cif','cif')}
                    /> CIF
                  </label>
                </div>
                <InputError message={form.errors.fob_or_cif} />
              </div>
            </div>
          )}

          {/* Line items */}
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  {['Art Num','Description','Size','HS Code','Qty','Unit Price','Sub‑Total',''].map(h => (
                    <th key={h} className="px-2 py-1 border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {form.data.items.map((itm:any, idx:number) => (
                  <tr key={idx}>
                    {[
                      ['art_num','text'],
                      ['description','text'],
                      ['size','text'],
                      ['hs_code','text'],
                      ['quantity','number'],
                      ['unit_price','number'],
                    ].map(([fld,typ]:any) => (
                      <td key={fld} className="px-1 py-1 border">
                        <input
                          type={typ}
                          value={itm[fld]}
                          onChange={e =>
                            updateItem(idx, fld,
                              typ==='number'
                                ? parseFloat(e.currentTarget.value||0)
                                : e.currentTarget.value
                            )}
                          className="w-full border rounded px-1 py-0.5"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-1 border text-right">
                      {itm.sub_total.toFixed(2)}
                    </td>
                    <td className="px-2 py-1 border text-center">
                      <button onClick={() => removeItem(idx)} className="text-red-600">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={addItem}
            >
              + Add Line
            </Button>
            <InputError message={form.errors.items} />
          </div>

          {/* Notes */}
          <div>
            <Label>Notes / Remarks</Label>
            <textarea
              value={form.data.notes}
              onChange={e => form.setData('notes', e.currentTarget.value)}
              className="mt-1 w-full border rounded px-2 py-1"
              rows={3}
            />
            <InputError message={form.errors.notes} />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 pt-4">
            <Button onClick={handlePreview}>See Preview</Button>
            <Button type="submit" variant="default">
              {isEdit ? 'Save Changes' : 'Create Invoice'}
            </Button>
            <Link href={route('invoices.index')} className="text-gray-600 hover:underline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
