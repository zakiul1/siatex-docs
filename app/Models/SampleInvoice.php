<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SampleInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_no',
        'shipper_id',
        'customer_id',
        'date',
        'buyer_account',
        'shipment_terms',
        'courier_name',
        'tracking_number',
        'footnotes',
    ];



    protected $casts = [
        'date' => 'date:Y-m-d',
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
        return $this->hasMany(SampleInvoiceItem::class);
    }

}