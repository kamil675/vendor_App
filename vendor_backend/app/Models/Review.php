<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'vendor_id',
        'order_id',
        'rating',
        'comment'
    ];

    // Review belongs to Vendor
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    // Review belongs to Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}