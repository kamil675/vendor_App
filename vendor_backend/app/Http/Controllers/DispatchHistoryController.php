<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DispatchHistory;
use App\Models\AuditLog;

class DispatchHistoryController extends Controller
{
    public function store(Request $request)
    {
        $dispatch = DispatchHistory::create([
            'equipment_request_id' => $request->equipment_request_id,
            'vendor_id' => auth()->id(),
            'action' => $request->action
        ]);

        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'DISPATCH_CREATED',
    'description' => $dispatch->action
]);

        return response()->json([
            'message' => 'Dispatch History Added',
            'data' => $dispatch
        ]);
    }

    public function index()
    {
        return response()->json(
            DispatchHistory::with([
                'vendor',
                'equipmentRequest'
            ])->get()
        );
    }

    public function show($id)
    {
        return response()->json(
            DispatchHistory::with([
                'vendor',
                'equipmentRequest'
            ])->findOrFail($id)
        );
    }

public function destroy($id)
{
    $dispatch = DispatchHistory::findOrFail($id);

    $action = $dispatch->action;

    $dispatch->delete();

    AuditLog::create([
        'vendor_id' => auth()->id(),
        'action' => 'DISPATCH_DELETED',
        'description' => $action
    ]);

    return response()->json([
        'message' => 'Dispatch Deleted'
    ]);
}
}