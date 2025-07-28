<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SampleInvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sample_invoice_id',
        'art_num',
        'description',
        'size',
        'hs_code',
        'qty',
        'unit_price',
    ];

    public function invoice()
    {
        return $this->belongsTo(SampleInvoice::class, 'sample_invoice_id');
    }
}