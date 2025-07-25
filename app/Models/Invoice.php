<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number',
        'type',
        'shipper_id',
        'customer_id',
        'buyer_account',
        'shipment_terms',
        'courier_name',
        'tracking_number',
        'notes',
        'issue_date',
        'delivery_date',
        'payment_mode',
        'terms_of_shipment',
        'currency',
        'commercial_cost',
        'discount',
        'fob_or_cif',
        'total_amount',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'delivery_date' => 'date',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function shipper(): BelongsTo
    {
        return $this->belongsTo(Shipper::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}