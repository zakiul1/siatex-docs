<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesInvoiceItem extends Model
{
    protected $fillable = [
        'art_num',
        'description',
        'size',
        'qty',
        'unit_price'
    ];

    public function invoice()
    {
        return $this->belongsTo(SalesInvoice::class, 'sales_invoice_id');
    }
}