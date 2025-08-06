// resources/js/Pages/SalesInvoices/Create.tsx

import React, { useEffect } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import InputError from '@/components/input-error'
import { Plus, X } from 'lucide-react'

type Shipper = {
  id: number
  name: string
  address: string
  phone?: string
  email?: string
  website?: string
  mobile?: string
  bank_ids: number[]
}
type Bank = {
  id: number
  name: string
  address: string
  swift_code: string
  phone?: string
  email?: string
}
type Customer = {
  id: number
  name: string
  address: string
}

export default function Create() {
  const { shippers, customers, banks, nextInvoiceNo } = usePage<{
    shippers: Shipper[]
    customers: Customer[]
    banks: Bank[]
    nextInvoiceNo?: string
  }>().props

  // Blank line‑item template
  const blankRow = {
    art_num:         '',
    description:     '',
    size:            '',
    qty:             '0',
    unit_price:      '0',
    commercial_cost: '0',
  }

  // Inertia form state + errors
  const { data, setData, post, processing, errors } = useForm({
    shipper_id:       '',
    customer_id:      '',
    invoice_no:       nextInvoiceNo?.toString() || '',
    type:             'LC',
    issue_date:       new Date().toISOString().slice(0, 10),
    delivery_date:    '',
    payment_mode:     '',
    currency:         'USD',
    siatex_discount:  '0',
    items:            [blankRow],
  })

  // Sync payment mode when type changes
  useEffect(() => {
    setData('payment_mode',
      data.type === 'LC'
        ? 'Transferable L/C at sight'
        : 'Telegraphic Transfer'
    )
  }, [data.type])

  // Lookups
  const shipper   = shippers.find(s => s.id === Number(data.shipper_id))
  const customer  = customers.find(c => c.id === Number(data.customer_id))
  const shipBanks = banks.filter(b => shipper?.bank_ids.includes(b.id))

  // Totals
  const subtotal        = data.items.reduce((sum, i) => sum + parseFloat(i.qty) * parseFloat(i.unit_price), 0)
  const commercialTotal = data.items.reduce((sum, i) => sum + parseFloat(i.commercial_cost || '0'), 0)
  const totalQty        = data.items.reduce((sum, i) => sum + parseFloat(i.qty), 0)
  const discount        = parseFloat(data.siatex_discount || '0')
  const grandTotal      = subtotal + commercialTotal - discount

  // Row controls
  const addRow    = () => setData('items', [...data.items, blankRow])
  const removeRow = (idx: number) => {
    let arr = data.items.filter((_, i) => i !== idx)
    if (!arr.length) arr = [blankRow]
    setData('items', arr)
  }

  // Inertia “Save” submit
  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    post(route('sales-invoices.store'))
  }

  // CSRF token for plain HTML preview form
  const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''

  return (
    <AppLayout>
      <Head title="Create Sales Invoice" />

      <form onSubmit={handleSave} className="p-6 bg-white space-y-6">
        {/* Shipper / Customer / Type */}
        <div className="flex items-end space-x-8">
          <div className="w-1/3">
            <label className="block mb-1">Select Shipper:</label>
            <select
              className="border p-2 w-full"
              value={data.shipper_id}
              onChange={e => setData('shipper_id', e.target.value)}
            >
              <option value="">— Select —</option>
              {shippers.map(s =>
                <option key={s.id} value={s.id}>{s.name}</option>
              )}
            </select>
            {errors.shipper_id && <InputError message={errors.shipper_id} />}
          </div>
          <div className="w-1/3">
            <label className="block mb-1">Customer:</label>
            <select
              className="border p-2 w-full"
              value={data.customer_id}
              onChange={e => setData('customer_id', e.target.value)}
            >
              <option value="">— Select —</option>
              {customers.map(c =>
                <option key={c.id} value={c.id}>{c.name}</option>
              )}
            </select>
            {errors.customer_id && <InputError message={errors.customer_id} />}
          </div>
          <div className="w-1/3">
            <label className="block mb-1">Type:</label>
            <RadioGroup
              value={data.type}
              onValueChange={v => setData('type', v)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem id="lc" value="LC" />
                <label htmlFor="lc">L/C Invoice</label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem id="tt" value="TT" />
                <label htmlFor="tt">TT Invoice</label>
              </div>
            </RadioGroup>
            {errors.type && <InputError message={errors.type} />}
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="w-1/2 text-sm whitespace-pre-line">
            {shipper && (
              <>
                <strong>{shipper.name}</strong><br/>
                {shipper.address}<br/>
                {shipper.phone   && <>Phone: {shipper.phone}<br/></>}
                {shipper.email   && <>Email: {shipper.email}<br/></>}
                {shipper.website && <>Website: {shipper.website}<br/></>}
                {shipper.mobile  && <>Mobile: {shipper.mobile}<br/></>}
              </>
            )}
          </div>
          <div className="w-1/2 text-right">
            <h2 className="text-xl font-semibold">PROFORMA INVOICE</h2>
            <div className="text-sm">
              INVOICE No.:
              <Input
                className="w-32 inline-block ml-2"
                value={data.invoice_no}
                onChange={e => setData('invoice_no', e.target.value)}
              />
            </div>
            {errors.invoice_no && <InputError message={errors.invoice_no} />}
          </div>
        </div>

        {/* Bank & Purchaser */}
        <div className="flex space-x-4">
          <div className="w-1/2 border p-4">
            <div className="font-medium mb-2">Our Bank Address:</div>
            {shipBanks.length ? shipBanks.map(b => (
              <div key={b.id} className="text-xs whitespace-pre-line mb-2">
                <strong>{b.name}</strong><br/>
                {b.address}<br/>
                SWIFT: {b.swift_code}<br/>
                {b.phone && <>Tel: {b.phone}<br/></>}
                {b.email && <>Email: {b.email}<br/></>}
              </div>
            )) : (
              <div className="text-gray-500">Select a shipper above</div>
            )}
          </div>
          <div className="w-1/2 border p-4">
            <div className="font-medium mb-2">Purchaser:</div>
            {customer ? (
              <div className="text-sm whitespace-pre-line">
                <strong>{customer.name}</strong><br/>
                {customer.address}
              </div>
            ) : (
              <div className="text-gray-500">Select a customer above</div>
            )}
          </div>
        </div>

        {/* Dates & Payment */}
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <label className="block mb-1">Issue Date</label>
            <Input
              type="date"
              value={data.issue_date}
              onChange={e => setData('issue_date', e.target.value)}
            />
            {errors.issue_date && <InputError message={errors.issue_date} />}
          </div>
          <div>
            <label className="block mb-1">Delivery Date</label>
            <Input
              type="date"
              value={data.delivery_date}
              onChange={e => setData('delivery_date', e.target.value)}
            />
            {errors.delivery_date && <InputError message={errors.delivery_date} />}
          </div>
          <div>
            <label className="block mb-1">Payment Mode</label>
            <Input
              value={data.payment_mode}
              onChange={e => setData('payment_mode', e.target.value)}
            />
            {errors.payment_mode && <InputError message={errors.payment_mode} />}
          </div>
          <div>
            <label className="block mb-1">Currency</label>
            <select
              className="border p-1 w-full"
              value={data.currency}
              onChange={e => setData('currency', e.target.value)}
            >
              <option>USD</option><option>EUR</option><option>GBP</option>
            </select>
            {errors.currency && <InputError message={errors.currency} />}
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full border-collapse text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              {['Art Num','Description','Size','Qty','Unit Price','Subtotal','Commercial Cost',''].map(h => (
                <th key={h} className="border px-2 py-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((row, i) => (
              <tr key={i}>
                <td className="border p-1">
                  <Input
                    value={row.art_num}
                    onChange={e => {
                      const c = [...data.items]; c[i].art_num = e.target.value; setData('items', c)
                    }}
                  />
                  {errors[`items.${i}.art_num`] && <InputError message={errors[`items.${i}.art_num`]} />}
                </td>
                <td className="border p-1">
                  <Input
                    value={row.description}
                    onChange={e => {
                      const c = [...data.items]; c[i].description = e.target.value; setData('items', c)
                    }}
                  />
                  {errors[`items.${i}.description`] && <InputError message={errors[`items.${i}.description`]} />}
                </td>
                <td className="border p-1">
                  <Input
                    value={row.size}
                    onChange={e => {
                      const c = [...data.items]; c[i].size = e.target.value; setData('items', c)
                    }}
                  />
                  {errors[`items.${i}.size`] && <InputError message={errors[`items.${i}.size`]} />}
                </td>
                <td className="border p-1">
                  <Input
                    type="number"
                    value={row.qty}
                    onChange={e => {
                      const c = [...data.items]; c[i].qty = e.target.value || '0'; setData('items', c)
                    }}
                  />
                  {errors[`items.${i}.qty`] && <InputError message={errors[`items.${i}.qty`]} />}
                </td>
                <td className="border p-1">
                  <Input
                    type="number"
                    step="0.01"
                    value={row.unit_price}
                    onChange={e => {
                      const c = [...data.items]; c[i].unit_price = e.target.value || '0'; setData('items', c)
                    }}
                  />
                  {errors[`items.${i}.unit_price`] && <InputError message={errors[`items.${i}.unit_price`]} />}
                </td>
                <td className="border p-1 text-right">
                  ${(parseFloat(row.qty) * parseFloat(row.unit_price)).toFixed(2)}
                </td>
                <td className="border p-1">
                  <Input
                    type="number"
                    step="0.01"
                    value={row.commercial_cost}
                    onChange={e => {
                      const c = [...data.items]; c[i].commercial_cost = e.target.value || '0'; setData('items', c)
                    }}
                  />
                  {errors[`items.${i}.commercial_cost`] && <InputError message={errors[`items.${i}.commercial_cost`]} />}
                </td>
                <td className="border p-1 text-center">
                  {i === 0
                    ? <Button type="button" size="sm" variant="outline" onClick={addRow}><Plus size={14}/></Button>
                    : <Button type="button" size="sm" variant="destructive" onClick={() => removeRow(i)}><X size={14}/></Button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Row */}
        <div className="flex justify-end items-center space-x-6 text-sm mb-4">
          <div>Total:</div><div className="w-24 text-right">${subtotal.toFixed(2)}</div>
          <div>Commercial Cost:</div><div className="w-24 text-right">${commercialTotal.toFixed(2)}</div>
          <div>{totalQty} Pcs</div>
          <div>Siatex Discount:</div>
          <div className="w-24 text-right">
            <Input
              type="number"
              className="w-full"
              value={data.siatex_discount}
              onChange={e => setData('siatex_discount', e.target.value)}
            />
            {errors.siatex_discount && <InputError message={errors.siatex_discount} />}
          </div>
          <div className="font-semibold">Grand Total:</div><div className="w-24 text-right font-semibold">${grandTotal.toFixed(2)}</div>
        </div>

        {/* Terms & Conditions */}
        <div className="border p-4 text-sm space-y-2">
          {data.type === 'LC' ? (
            <>
              <div className="font-medium">Terms and Condition (required in the L/C):</div>
              <ol className="list-decimal list-inside leading-tight">
                <li>The type of the L/C is irrevocable and transferable at sight.</li>
                <li>This L/C should be transferred by Uttara Bank Ltd.</li>
                <li>Trans-shipments and partial shipments are allowed.</li>
                <li>+/- 3% in quantity and value is accepted.</li>
                <li>Negotiations are allowed with any Bank in Bangladesh.</li>
                <li>All discrepancies will be acceptable, except late shipment, prices and quantities.</li>
                <li>Country of origin: Bangladesh.</li>
              </ol>
              <div className="text-center uppercase font-medium">
                Please keep the following words in the B/L or AWB terms:<br/>
                <em className="text-xs">
                  "Full set clean on board ocean bill of lading / airway bill made out to the order of the negotiating bank in Bangladesh and endorsed to the L/C opening bank marked freight Collect."
                </em>
              </div>
              <div className="border text-center uppercase font-semibold py-1">
                PLEASE ADVISE THE L/C THROUGH OUR BANK AS ABOVE
              </div>
            </>
          ) : (
            <>
              <div className="font-medium">Terms and Condition:</div>
              <ol className="list-decimal list-inside leading-tight">
                <li>All the charges of sender’s and receiver’s banks are sender / purchaser’s account.</li>
              </ol>
              <div className="border text-center uppercase font-semibold py-1">
                PLEASE ADVISE THE TT THROUGH OUR BANK AS ABOVE
              </div>
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={processing}>Create Invoice</Button>
        </div>
      </form>

      {/* Plain HTML Preview Form */}
      <div className="p-6 bg-white border-t">
        <form action={route('sales-invoices.preview-json')} method="POST" target="_blank" className="inline">
          <input type="hidden" name="_token" value={csrf} />
          <input type="hidden" name="shipper_id"    value={data.shipper_id} />
          <input type="hidden" name="customer_id"   value={data.customer_id} />
          <input type="hidden" name="invoice_no"    value={data.invoice_no} />
          <input type="hidden" name="type"          value={data.type} />
          <input type="hidden" name="issue_date"    value={data.issue_date} />
          <input type="hidden" name="delivery_date" value={data.delivery_date} />
          <input type="hidden" name="payment_mode"  value={data.payment_mode} />
          <input type="hidden" name="currency"      value={data.currency} />
          <input type="hidden" name="siatex_discount" value={data.siatex_discount} />
          {data.items.map((row, i) => (
            <React.Fragment key={i}>
              <input type="hidden" name={`items[${i}][art_num]`}         value={row.art_num} />
              <input type="hidden" name={`items[${i}][description]`}     value={row.description} />
              <input type="hidden" name={`items[${i}][size]`}            value={row.size} />
              <input type="hidden" name={`items[${i}][qty]`}             value={row.qty} />
              <input type="hidden" name={`items[${i}][unit_price]`}      value={row.unit_price} />
              <input type="hidden" name={`items[${i}][commercial_cost]`} value={row.commercial_cost} />
            </React.Fragment>
          ))}
          <Button type="submit" variant="outline" disabled={processing}>
            Preview PDF
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}
