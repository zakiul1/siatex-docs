{{-- resources/views/sample-invoices/pdf.blade.php --}}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
        }

        .container {
            padding: 20px;
            box-sizing: border-box;
        }

        /* Header */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        .header-table td {
            vertical-align: top;
        }

        .header-left {
            width: 50%;
        }

        .header-right {
            width: 50%;
            text-align: right;
        }

        .shipper-name {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 4px;
        }

        .shipper-info p {
            margin: 2px 0;
            line-height: 1.3;
        }

        .invoice-no-label {
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .invoice-no-box {
            display: inline-block;
            padding: 6px 12px;
            border: 1px solid #ccc;
            background: #f7f7f7;
        }

        /* Details/Receiver table */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        .info-table td {
            vertical-align: top;
            border: 1px solid #ccc;
            padding: 0;
            width: 50%;
        }

        .info-header {
            background: #f0f0f0;
            padding: 6px 8px;
            font-weight: bold;
            border-bottom: 1px solid #ccc;
        }

        .info-body {
            padding: 8px;
        }

        .info-body p {
            margin: 4px 0;
            line-height: 1.3;
        }

        /* Items table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        .items-table th,
        .items-table td {
            border: 1px solid #ccc;
            padding: 6px 8px;
            text-align: left;
        }

        .items-table th {
            background: #f0f0f0;
        }

        .items-table tfoot td {
            border: none;
            padding-top: 8px;
        }

        .total-cell {
            text-align: right;
            font-weight: bold;
        }

        /* Footnotes */
        .footer-notes {
            font-size: 10px;
            line-height: 1.3;
        }
    </style>
</head>

<body>
    <div class="container">
        {{-- Header --}}
        <table class="header-table">
            <tr>
                <td class="header-left">
                    <div class="shipper-name">{{ $invoice->shipper->name }}</div>
                    <div class="shipper-info">
                        {!! nl2br(e($invoice->shipper->address)) !!}<br>
                        @if ($invoice->shipper->phone)
                            Phone: {{ $invoice->shipper->phone }}<br>
                        @endif
                        @if ($invoice->shipper->fax)
                            Fax: {{ $invoice->shipper->fax }}<br>
                        @endif
                        @if ($invoice->shipper->email)
                            Email: {{ $invoice->shipper->email }}<br>
                        @endif
                        @if ($invoice->shipper->web)
                            Web: {{ $invoice->shipper->web }}<br>
                        @endif
                    </div>
                </td>
                <td class="header-right">
                    <div class="invoice-no-label">Invoice No.</div>
                    <div class="invoice-no-box">{{ $invoice->invoice_no }}</div>
                </td>
            </tr>
        </table>

        {{-- Details & Receiver (50/50) --}}
        <table class="info-table">
            <tr>
                <td>
                    <div class="info-header">Details:</div>
                    <div class="info-body">
                        <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($invoice->date)->format('jS M Y') }}</p>
                        <p><strong>Buyer Account:</strong> {{ $invoice->buyer_account }}</p>
                        <p><strong>Shipment Terms:</strong> {{ $invoice->shipment_terms }}</p>
                        <p><strong>Courier Name:</strong> {{ $invoice->courier_name }}</p>
                        <p><strong>Tracking Number:</strong> {{ $invoice->tracking_number }}</p>
                    </div>
                </td>
                <td>
                    <div class="info-header">Receiver:</div>
                    <div class="info-body">
                        <p>{{ $invoice->customer->name }}</p>
                        <p>{!! nl2br(e($invoice->customer->address)) !!}</p>
                        @if ($invoice->customer->contact_name)
                            <p><strong>Attention:</strong> {{ $invoice->customer->contact_name }}</p>
                        @endif
                    </div>
                </td>
            </tr>
        </table>

        {{-- Items --}}
        <table class="items-table">
            <thead>
                <tr>
                    <th>Art Num</th>
                    <th>Description</th>
                    <th>Size</th>
                    <th>HS Code</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Sub Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($invoice->items as $item)
                    <tr>
                        <td>{{ $item->art_num }}</td>
                        <td>{{ $item->description }}</td>
                        <td>{{ $item->size }}</td>
                        <td>{{ $item->hs_code }}</td>
                        <td>{{ $item->qty }}</td>
                        <td>${{ number_format($item->unit_price, 2) }}</td>
                        <td>${{ number_format($item->qty * $item->unit_price, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6" class="total-cell">Total Price:</td>
                    <td>${{ number_format($invoice->items->sum(fn($i) => $i->qty * $i->unit_price), 2) }}</td>
                </tr>
            </tfoot>
        </table>

        {{-- Footnotes --}}
        <div class="footer-notes">
            {!! nl2br(e($invoice->footnotes)) !!}
        </div>
    </div>
</body>

</html>
