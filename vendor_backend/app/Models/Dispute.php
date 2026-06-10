<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    protected $fillable = [

        'vendor_id',
        'order_id',
        'title',
        'description',
        'status'

    ];
}