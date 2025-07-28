<?php

namespace App\Http\Controllers;

use App\Models\SampleInvoice;
use App\Models\SampleInvoiceItem;
use App\Models\Shipper;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PDF;

class SampleInvoiceController extends Controller
{
    public function index(Request $request)
    {
        $q = SampleInvoice::with(['shipper', 'customer'])
            ->orderBy('created_at', 'desc');

        if ($search = $request->get('search')) {
            $q->where('invoice_no', 'like', "%{$search}%");
        }

        $invoices = $q->paginate(10)->withQueryString();

        return Inertia::render('SampleInvoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('SampleInvoices/Create', [
            'shippers' => Shipper::select('id', 'name', 'address', 'phone', 'email', 'bank_ids')->get(),
            'customers' => Customer::select('id', 'name', 'address', 'mobile')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'shipper_id' => 'required|exists:shippers,id',
            'customer_id' => 'required|exists:customers,id',
            'date' => 'required|date',
            'buyer_account' => 'nullable|string',
            'shipment_terms' => 'required|in:Collect,Prepaid',
            'courier_name' => 'nullable|string',
            'tracking_number' => 'nullable|string',
            'footnotes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.qty' => 'required|integer',
            'items.*.unit_price' => 'required|numeric',
        ]);

        // auto‑generate invoice_no
        $last = SampleInvoice::latest('id')->first();
        $v['invoice_no'] = $last
            ? $last->invoice_no + 1
            : now()->format('ymd') . '001';

        $invoice = SampleInvoice::create($v);

        foreach ($v['items'] as $item) {
            $invoice->items()->create($item);
        }

        return redirect()->route('sample-invoices.index');
    }

    public function edit(SampleInvoice $sample_invoice)
    {
        $sample_invoice->load(['items']);

        return Inertia::render('SampleInvoices/Edit', [
            'invoice' => $sample_invoice,
            'shippers' => Shipper::select('id', 'name', 'address', 'phone', 'email', 'bank_ids')->get(),
            'customers' => Customer::select('id', 'name', 'address', 'mobile')->get(),
        ]);
    }

    public function update(Request $request, SampleInvoice $sample_invoice)
    {
        $v = $request->validate([
            'shipper_id' => 'required|exists:shippers,id',
            'customer_id' => 'required|exists:customers,id',
            'date' => 'required|date',
            'buyer_account' => 'nullable|string',
            'shipment_terms' => 'required|in:Collect,Prepaid',
            'courier_name' => 'nullable|string',
            'tracking_number' => 'nullable|string',
            'footnotes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.qty' => 'required|integer',
            'items.*.unit_price' => 'required|numeric',
        ]);

        $sample_invoice->update($v);

        // re-sync items
        $sample_invoice->items()->delete();
        foreach ($v['items'] as $item) {
            $sample_invoice->items()->create($item);
        }

        return redirect()->route('sample-invoices.index');
    }

    public function destroy(SampleInvoice $sample_invoice)
    {
        $sample_invoice->delete();
        return redirect()->route('sample-invoices.index');
    }

    // Preview (render view and also PDF download if requested)
    public function preview(Request $request)
    {
        $v = $request->validate([
            'shipper_id',
            'customer_id',
            'date',
            'buyer_account',
            'shipment_terms',
            'courier_name',
            'tracking_number',
            'footnotes',
            'items' => 'array',
        ]);

        // pass raw data to React preview page
        if ($request->wantsJson()) {
            return Inertia::render('SampleInvoices/Show', [
                'invoice' => (object) $v
            ]);
        }

        // or generate PDF
        $pdf = PDF::loadView('sample-invoices.pdf', ['invoice' => (object) $v]);
        return $pdf->download("sample-invoice-{$v['date']}.pdf");
    }

    public function show(SampleInvoice $sample_invoice)
    {
        $sample_invoice->load(['shipper', 'customer', 'items']);
        return Inertia::render('SampleInvoices/Show', [
            'invoice' => $sample_invoice,
        ]);
    }

    /**
     * Download the invoice as a PDF.
     */
    public function download(SampleInvoice $sample_invoice)
    {
        // eager‑load relationships
        $sample_invoice->load(['shipper', 'customer', 'items']);

        // render the same blade you use for PDF
        $pdf = PDF::loadView('sample-invoices.pdf', [
            'invoice' => $sample_invoice,
        ]);

        return $pdf->download("sample-invoice-{$sample_invoice->invoice_no}.pdf");
    }

}