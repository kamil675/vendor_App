<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function index()
    {
        return AuditLog::where(
            'vendor_id',
            auth()->id()
        )
        ->latest()
        ->get();
    }
}