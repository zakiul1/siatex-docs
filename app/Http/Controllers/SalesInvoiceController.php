<?php

namespace App\Http\Controllers;

use App\Models\SalesInvoice;
use App\Models\Shipper;
use App\Models\Customer;
use App\Models\Bank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\LaravelPdf\Facades\Pdf;
use function Spatie\LaravelPdf\Support\pdf;

class SalesInvoiceController extends Controller
{
    protected function nextInvoiceNumber(): string
    {
        $last = SalesInvoice::latest('id')->first();

        return $last
            ? (string) ($last->invoice_no + 1)
            : now()->format('ymd') . '001';
    }

    public function index(Request $request)
    {
        $q = SalesInvoice::with(['shipper', 'customer', 'items'])  // ← include 'items' here
            ->orderBy('created_at', 'desc');

        if ($search = $request->get('search')) {
            $q->where('invoice_no', 'like', "%{$search}%");
        }

        $invoices = $q->paginate(10)->withQueryString();

        return Inertia::render('SalesInvoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only('search'),
        ]);
    }


    public function create()
    {
        return Inertia::render('SalesInvoices/Create', [
            'shippers' => Shipper::all(['id', 'name', 'address', 'phone', 'email', 'website', 'mobile', 'bank_ids']),
            'customers' => Customer::all(['id', 'name', 'address', 'mobile']),
            'banks' => Bank::all(['id', 'name', 'address', 'swift_code', 'phone', 'email']),
            'nextInvoiceNo' => $this->nextInvoiceNumber(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:LC,TT',
            'shipper_id' => 'required|exists:shippers,id',
            'customer_id' => 'required|exists:customers,id',
            'issue_date' => 'required|date',
            'delivery_date' => 'nullable|date',
            'payment_mode' => 'nullable|string',
            'terms_of_shipment' => 'nullable|string',
            'currency' => 'required|string|size:3',
            'siatex_discount' => 'nullable|numeric',
            'footnotes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.art_num' => 'nullable|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.size' => 'nullable|string|max:100',
            'items.*.qty' => 'required|integer|min:0',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.commercial_cost' => 'nullable|numeric|min:0',
        ]);

        $data['invoice_no'] = $this->nextInvoiceNumber();

        $invoice = SalesInvoice::create($data);

        foreach ($data['items'] as $item) {
            $invoice->items()->create($item);
        }

        return redirect()->route('sales-invoices.index');
    }

    public function edit(SalesInvoice $sales_invoice)
    {
        $sales_invoice->load('items');

        return Inertia::render('SalesInvoices/Edit', [
            'invoice' => $sales_invoice,
            'shippers' => Shipper::all(['id', 'name', 'address', 'phone', 'email', 'website', 'mobile', 'bank_ids']),
            'customers' => Customer::all(['id', 'name', 'address', 'mobile']),
            'banks' => Bank::all(['id', 'name', 'address', 'swift_code', 'phone', 'email']),
        ]);
    }

    public function update(Request $request, SalesInvoice $sales_invoice)
    {
        $data = $request->validate([
            'type' => 'required|in:LC,TT',
            'shipper_id' => 'required|exists:shippers,id',
            'customer_id' => 'required|exists:customers,id',
            'issue_date' => 'required|date',
            'delivery_date' => 'nullable|date',
            'payment_mode' => 'nullable|string',
            'terms_of_shipment' => 'nullable|string',
            'currency' => 'required|string|size:3',
            'siatex_discount' => 'nullable|numeric',
            'footnotes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.art_num' => 'nullable|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.size' => 'nullable|string|max:100',
            'items.*.qty' => 'required|integer|min:0',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.commercial_cost' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($sales_invoice, $data) {
            $sales_invoice->update($data);
            $sales_invoice->items()->delete();
            foreach ($data['items'] as $item) {
                $sales_invoice->items()->create($item);
            }
        });

        return redirect()->route('sales-invoices.index');
    }

    public function show(SalesInvoice $sales_invoice)
    {
        $sales_invoice->load(['shipper', 'customer', 'items']);

        return Inertia::render('SalesInvoices/Show', [
            'invoice' => $sales_invoice,
        ]);
    }

    /**
     * Preview PDF inline using Spatie PDF
     */
    public function preview(Request $request)
    {
        $data = $request->validate([
            // same validation as store/update...
        ]);

        // Ensure invoice_no always set
        $data['invoice_no'] = $data['invoice_no'] ?? $this->nextInvoiceNumber();

        $shipper = Shipper::findOrFail($data['shipper_id']);
        $customer = Customer::findOrFail($data['customer_id']);
        $bankList = Bank::whereIn('id', $shipper->bank_ids ?? [])->get();

        // Build simple object for Blade
        $invoice = (object) array_merge($data, [
            'shipper' => $shipper,
            'customer' => $customer,
            'items' => $data['items'],
        ]);

        // return inline PDF
        return pdf()
            ->view('sales-invoices.pdf', compact('invoice', 'bankList'))
            ->name("sales-invoice-{$invoice->invoice_no}.pdf");
        // by default it's inline; add ->download() to force download
    }

    /**
     * Download PDF file
     */
    public function download(SalesInvoice $sales_invoice)
    {
        $sales_invoice->load(['shipper', 'customer', 'items']);
        $bankList = Bank::whereIn('id', $sales_invoice->shipper->bank_ids ?? [])->get();

        return pdf()
            ->view('sales-invoices.pdf', [
                'invoice' => $sales_invoice,
                'bankList' => $bankList,
            ])
            ->name("sales-invoice-{$sales_invoice->invoice_no}.pdf")
            ->download();
    }

    public function destroy(SalesInvoice $sales_invoice)
    {
        $sales_invoice->delete();
        return back();
    }
}