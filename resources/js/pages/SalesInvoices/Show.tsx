import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, Link, usePage } from '@inertiajs/react'
import { route } from 'ziggy-js'
import { Button } from '@/components/ui/button'
import {
  Table, TableHeader, TableHead, TableBody,
  TableRow, TableCell
} from '@/components/ui/table'

export default function Show() {
  const { invoice, banks } = usePage<{
    invoice: any,
    banks: Array<{
      id: number
      name: string
      address: string
      swift_code: string
      phone?: string
      email?: string
    }>
  }>().props

  // Totals
  const subtotal   = invoice.items.reduce((sum: number, i: any) => sum + i.qty * i.unit_price, 0)
  const discount   = invoice.siatex_discount || 0
  const grandTotal = subtotal - discount

  // Ship banks
  const shipBanks = banks.filter(b => invoice.shipper.bank_ids.includes(b.id))

  return (
    <AppLayout>
      <Head title={`Invoice #${invoice.invoice_no}`} />

      <div className="p-8 space-y-6 bg-white rounded shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Proforma Invoice #{invoice.invoice_no}
          </h2>

          {/* only show Download/Back if we have a real invoice.id */}
          {invoice.id && (
            <div className="space-x-2">
              <Button asChild>
                <Link
                  href={route('sales-invoices.download', invoice.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={route('sales-invoices.index')}>← Back</Link>
              </Button>
            </div>
          )}
        </div>

        {/* … Bank & Purchaser panels, Dates, Table, Totals … */}

        {/* only embed iframe if real invoice.id */}
        {invoice.id && (
          <div className="mt-6">
            <div className="font-medium mb-2">PDF Preview:</div>
            <iframe
              src={route('sales-invoices.preview', invoice.id)}
              className="w-full h-[800px] border"
              title="Invoice Preview"
            />
          </div>
        )}
      </div>
    </AppLayout>
  )
}
