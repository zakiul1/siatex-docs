{{-- resources/views/sales-invoices/pdf.blade.php --}}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Proforma Invoice {{ $invoice->invoice_no }}</title>
    <style>
        @font-face {
            font-family: 'Helvetica';
            src: local('Helvetica'), url('Helvetica.ttf') format('truetype');
        }

        body {
            font-family: 'Helvetica', Arial, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }

        .container {
            width: 800px;
            margin: 20px auto;
            padding: 20px;
            background: #fff;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }

        .header-info {
            font-size: 10px;
            margin-bottom: 6px;
            text-align: right;
        }

        .flex {
            display: flex;
            justify-content: space-between;
        }

        .box {
            width: 48%;
            vertical-align: top;
        }

        .bordered {
            border: 1px solid #333;
            padding: 8px;
            box-sizing: border-box;
        }

        h1 {
            margin: 0;
            font-size: 24px;
        }

        .invoice-no-box {
            display: inline-block;
            border: 1px solid #333;
            padding: 4px 8px;
            margin-top: 6px;
            font-weight: bold;
            font-size: 14px;
        }

        .section {
            margin-top: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }

        table th,
        table td {
            border: 1px solid #666;
            padding: 6px;
            font-size: 11px;
        }

        table th {
            background: #eee;
            text-transform: uppercase;
        }

        .text-right {
            text-align: right;
        }

        .totals {
            margin-top: 6px;
            width: 100%;
            display: flex
        }

        .totals .label {
            width: 80%;
            text-align: right;
            padding-right: 10px;
        }

        .totals .value {
            width: 20%;
            text-align: right;
        }

        .terms {
            margin-top: 30px;
            font-size: 10px;
        }

        .terms ol {
            margin: 0;
            padding-left: 20px;
        }

        .terms .notice {
            margin-top: 10px;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            padding: 6px;
            border: 1px solid #333;
        }
    </style>
</head>

<body>
    <div class="container">
        {{-- Page count --}}
        <div class="header-info">1 of Total Page – 1</div>

        {{-- Top Header --}}
        <div class="flex">
            <div class="box">
                @if ($invoice->shipper)
                    <strong>{{ $invoice->shipper->name }}</strong><br>
                    {!! nl2br(e($invoice->shipper->address)) !!}<br>
                    @if (!empty($invoice->shipper->phone))
                        Phone: {{ $invoice->shipper->phone }}<br>
                    @endif
                    @if (!empty($invoice->shipper->email))
                        Email: {{ $invoice->shipper->email }}<br>
                    @endif
                    @if (!empty($invoice->shipper->website))
                        Website: {{ $invoice->shipper->website }}<br>
                    @endif
                    @if (!empty($invoice->shipper->mobile))
                        Mobile: {{ $invoice->shipper->mobile }}<br>
                    @endif
                @endif
            </div>
            <div class="box text-right">
                <h1>PROFORMA INVOICE</h1>
                <div class="invoice-no-box">{{ $invoice->invoice_no }}</div>
            </div>
        </div>

        {{-- Bank & Receiver --}}
        <div class="section flex">
            <div class="box bordered">
                <strong>Our Bank Address:</strong><br>
                @foreach ($bankList as $bank)
                    <strong>{{ $bank->name }}</strong><br>
                    {!! nl2br(e($bank->address)) !!}<br>
                    SWIFT: {{ $bank->swift_code }}<br>
                    @if (!empty($bank->phone))
                        Tel: {{ $bank->phone }}<br>
                    @endif
                    @if (!empty($bank->email))
                        Email: {{ $bank->email }}<br>
                    @endif
                    <br>
                @endforeach
            </div>
            <div class="box bordered">
                <strong>Receiver:</strong><br>
                @if ($invoice->customer)
                    <strong>{{ $invoice->customer->name }}</strong><br>
                    {!! nl2br(e($invoice->customer->address)) !!}
                @endif
            </div>
        </div>

        {{-- Dates / Shipment Terms --}}
        <div class="section">
            <table>
                <tr>
                    <th>Issue Date</th>
                    <th>Delivery Date</th>
                    <th>Payment Mode</th>
                    <th>Terms of Shipment</th>
                    <th>Currency</th>
                </tr>
                <tr>
                    <td>{{ \Carbon\Carbon::parse($invoice->issue_date)->format('j M Y') }}</td>
                    <td>
                        @if ($invoice->delivery_date)
                            {{ \Carbon\Carbon::parse($invoice->delivery_date)->format('j M Y') }}
                        @else
                            —
                        @endif
                    </td>
                    <td>{{ $invoice->payment_mode }}</td>
                    <td>{{ $invoice->terms_of_shipment ?? '—' }}</td>
                    <td>{{ $invoice->currency }}</td>
                </tr>
            </table>
        </div>

        {{-- Line Items --}}
        <div class="section">
            <table>
                <thead>
                    <tr>
                        <th>Art Num</th>
                        <th>Article Description</th>
                        <th>Size</th>
                        <th class="text-right">Qty</th>
                        <th class="text-right">Unit Price (USD)</th>
                        <th class="text-right">Sub Total (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($invoice->items as $item)
                        <tr>
                            <td>{{ $item->art_num }}</td>
                            <td>{{ $item->description }}</td>
                            <td>{{ $item->size }}</td>
                            <td class="text-right">{{ $item->qty }}</td>
                            <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                            <td class="text-right">
                                {{ number_format($item->qty * $item->unit_price, 2) }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- Total Price --}}
        <div class="totals">
            <div class="label"><strong>Total Price (USD):</strong></div>
            <div class="value">
                ${{ number_format($invoice->items->sum(fn($i) => $i->qty * $i->unit_price), 2) }}
            </div>
        </div>

        {{-- Terms & Conditions --}}
        <div class="terms">
            <strong>
                Terms and Condition
                @if ($invoice->type === 'LC')
                    (required in the L/C)
                @endif:
            </strong>
            <ol>
                @if ($invoice->type === 'LC')
                    <li>The type of the L/C is irrevocable and transferable at sight.</li>
                    <li>This L/C should be forwarded by Uttara Bank Ltd.</li>
                    <li>Trans‑shipments and partial shipments are allowed.</li>
                    <li>±3% in quantity and value is accepted.</li>
                    <li>Negotiations are allowed with any Bank in Bangladesh.</li>
                    <li>All discrepancies will be acceptable, except late shipment, prices and quantities.</li>
                @else
                    <li>All the charges of sender’s and receiver’s banks are sender / purchaser’s account.</li>
                @endif
            </ol>
            <div class="notice">
                PLEASE ADVISE THE {{ $invoice->type === 'LC' ? 'L/C' : 'TT' }} THROUGH OUR BANK AS ABOVE
            </div>
        </div>
    </div>
</body>

</html>
