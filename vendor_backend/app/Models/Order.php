<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'vendor_id',
        'catalogue_id',
        'quantity',
        'total_price',
        'status'
    ];

    // Order belongs to Vendor
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    // Order belongs to Catalogue
    public function catalogue()
    {
        return $this->belongsTo(Catalogue::class);
    }

    // One order has one review
    public function review()
    {
        return $this->hasOne(Review::class);
    }
}