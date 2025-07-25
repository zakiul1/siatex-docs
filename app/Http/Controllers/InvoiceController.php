<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Shipper;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        // Build the base query with optional search
        $query = Invoice::with('shipper', 'customer')
            ->when($search, fn($q) => $q->where('invoice_number', 'like', "%{$search}%"));

        // Paginate (preserving query string for links)
        $paginator = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Transform each item, but keep the paginator's meta intact
        $transformed = $paginator
            ->getCollection()
            ->map(fn($inv) => [
                'id' => $inv->id,
                'invoice_number' => $inv->invoice_number,
                'type' => $inv->type,
                'shipper' => $inv->shipper->name,
                'customer' => $inv->customer->name,
                'date' => optional($inv->issue_date)->format('d M Y'),
                'total_amount' => $inv->total_amount,
            ]);

        // Swap the underlying collection
        $paginator->setCollection($transformed);

        return Inertia::render('Invoices/Index', [
            'invoices' => $paginator,
            'filters' => ['search' => $search],
            'toastData' => session('toastData') ?? null,
        ]);
    }

    public function create()
    {
        return Inertia::render('Invoices/Form', [
            'invoice' => null,
            'shippers' => Shipper::select('id', 'name')->get(),
            'customers' => Customer::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $data['invoice_number'] = $this->generateInvoiceNumber();

        DB::transaction(function () use ($data) {
            $items = $data['items'];
            $data['total_amount'] = collect($items)->sum(fn($i) => $i['sub_total']);

            $invoice = Invoice::create(Arr::except($data, ['items']));
            foreach ($items as $item) {
                $invoice->items()->create($item);
            }
        });

        return redirect()->route('invoices.index')
            ->with('toastData', [
                'title' => 'Success',
                'message' => 'Invoice created.',
                'type' => 'success'
            ]);
    }

    public function preview(Request $request)
    {
        $data = $this->validateData($request);
        $data['total_amount'] = collect($data['items'])->sum(fn($i) => $i['sub_total']);

        return Inertia::render('Invoices/Preview', ['invoice' => $data]);
    }

    public function show(Invoice $invoice)
    {
        $invoice->load('items', 'shipper', 'customer');
        return Inertia::render('Invoices/Preview', ['invoice' => $invoice]);
    }

    public function edit(Invoice $invoice)
    {
        $invoice->load('items');
        return Inertia::render('Invoices/Form', [
            'invoice' => $invoice,
            'shippers' => Shipper::select('id', 'name')->get(),
            'customers' => Customer::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $data = $this->validateData($request, $invoice->id);

        DB::transaction(function () use ($invoice, $data) {
            $items = $data['items'];
            $data['total_amount'] = collect($items)->sum(fn($i) => $i['sub_total']);

            $invoice->update(Arr::except($data, ['items']));
            $invoice->items()->delete();
            foreach ($items as $item) {
                $invoice->items()->create($item);
            }
        });

        return redirect()->route('invoices.index')
            ->with('toastData', [
                'title' => 'Success',
                'message' => 'Invoice updated.',
                'type' => 'success'
            ]);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return redirect()->route('invoices.index')
            ->with('toastData', [
                'title' => 'Deleted',
                'message' => 'Invoice removed.',
                'type' => 'success'
            ]);
    }

    protected function validateData(Request $request, $id = null): array
    {
        $common = [
            'type' => ['required', Rule::in(['sample', 'sales'])],
            'shipper_id' => 'required|exists:shippers,id',
            'customer_id' => 'required|exists:customers,id',
            'buyer_account' => 'nullable|string|max:255',
            'shipment_terms' => 'nullable|string|max:255',
            'courier_name' => 'nullable|string|max:255',
            'tracking_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ];

        if ($request->input('type') === 'sales') {
            $common = array_merge($common, [
                'issue_date' => 'required|date',
                'delivery_date' => 'nullable|date|after_or_equal:issue_date',
                'payment_mode' => 'nullable|string|max:255',
                'terms_of_shipment' => 'nullable|string|max:255',
                'currency' => 'nullable|string|max:10',
                'commercial_cost' => 'nullable|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'fob_or_cif' => ['nullable', Rule::in(['fob', 'cif'])],
            ]);
        }

        return $request->validate($common);
    }

    protected function generateInvoiceNumber(): string
    {
        $lastId = Invoice::latest('id')->first()?->id ?? 0;
        return (string) ($lastId + 1 + 100000);
    }
}