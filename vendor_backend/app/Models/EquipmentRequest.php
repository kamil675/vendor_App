<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentRequest extends Model
{
    protected $fillable = [
        'vendor_id',
        'equipment_name',
        'quantity',
        'description',
        'status'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}