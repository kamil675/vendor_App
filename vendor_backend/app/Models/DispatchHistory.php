<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DispatchHistory extends Model
{
    protected $fillable = [
        'equipment_request_id',
        'vendor_id',
        'action'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function equipmentRequest()
    {
        return $this->belongsTo(EquipmentRequest::class);
    }
}