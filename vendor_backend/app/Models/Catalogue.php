<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Catalogue extends Model
{
protected $fillable = [
    'vendor_id',
    'product_name',
    'price',
    'description',
    'images',
    'category',
    'stock_qty',
    'min_order_qty',
    'delivery_option',
    'status'
];

protected $casts = [
    'images' => 'array'
];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}