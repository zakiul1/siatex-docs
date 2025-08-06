<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesInvoice extends Model
{
    protected $fillable = [
        'invoice_no',
        'type',
        'shipper_id',
        'customer_id',
        'issue_date',
        'delivery_date',
        'payment_mode',
        'terms_of_shipment',
        'currency',
        'siatex_discount',
        'footnotes',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'delivery_date' => 'date',
    ];

    public function shipper()
    {
        return $this->belongsTo(Shipper::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(SalesInvoiceItem::class);
    }

    public function getSubtotalAttribute()
    {
        return $this->items->sum(fn($i) => $i->qty * $i->unit_price);
    }

    public function getTotalAttribute()
    {
        return $this->subtotal - $this->siatex_discount;
    }
}