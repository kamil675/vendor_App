<?php

namespace App\Http\Controllers;

use App\Models\EquipmentRequest;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use App\Events\VendorNotificationEvent;

class EquipmentRequestController extends Controller
{
    public function store(Request $request)
    {
        $equipment=EquipmentRequest::create([
            'vendor_id'=>auth()->user()->id,
            'equipment_name'=>$request->equipment_name,
            'quantity'=>$request->quantity,
            'description'=>$request->description,
            'status'=>'Pending'
        ]);

        

        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'REQUEST_CREATED',
    'description' => $equipment->equipment_name.' Request Created'
]);

        return response()->json([
            'message'=>"Request Created",
            'data'=>$equipment
        ]);
    }

    public function index()
    {
        return EquipmentRequest::where(
            'vendor_id',
            auth()->user()->id
        )->get();
    }

public function show($id)
{
    return EquipmentRequest::where(
        'vendor_id',
        auth()->id()
    )
    ->findOrFail($id);
}

    public function destroy($id)
    {
        EquipmentRequest::find($id)->delete();

        return response()->json([
            'message'=>"Deleted Successfully"
        ]);
    }

    public function accept($id)
{
    $request = EquipmentRequest::findOrFail($id);

    $request->update([
        'status' => 'Accepted'
    ]);

    broadcast(
    new VendorNotificationEvent([
        'type' => 'REQUEST_ACCEPTED',
        'request_id' => $request->id,
        'status' => 'ACCEPTED'
    ])
);

    AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'REQUEST_ACCEPTED',
    'description' => $request->equipment_name.' Request Accepted'
]);

    return response()->json([
        'message' => 'Request Accepted',
        'data' => $request
    ]);
}


public function decline($id)
{
    $request = EquipmentRequest::findOrFail($id);

    $request->update([
        'status' => 'Declined'
    ]);

    AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'REQUEST_DECLINED',
    'description' => $request->equipment_name.' Request Declined'
]);

    return response()->json([
        'message' => 'Request Declined',
        'data' => $request
    ]);
}

public function progress($id)
{
    $request = EquipmentRequest::findOrFail($id);

    $request->update([
        'status' => 'In Progress'
    ]);

    broadcast(
    new VendorNotificationEvent([
        'type' => 'REQUEST_PROGRESS',
        'request_id' => $request->id,
        'status' => 'IN_PROGRESS'
    ])
);

    return response()->json([
        'message' => 'Request In Progress',
        'data' => $request
    ]);
}

public function complete($id)
{
    $request = EquipmentRequest::findOrFail($id);

    $request->update([
        'status' => 'Completed'
    ]);
    
    broadcast(
    new VendorNotificationEvent([
        'type' => 'REQUEST_COMPLETED',
        'request_id' => $request->id,
        'status' => 'COMPLETED'
    ])
);

    AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'REQUEST_COMPLETED',
    'description' => $request->equipment_name.' Request Completed'
]);

    return response()->json([
        'message' => 'Request Completed',
        'data' => $request
    ]);
}

public function cancel($id)
{
    $request = EquipmentRequest::findOrFail($id);

    if(
        $request->status != 'Pending'
    ){
        return response()->json([
            'message' => 'Only Pending Request Can Be Cancelled'
        ],400);
    }

    $request->update([
        'status' => 'Cancelled'
    ]);
    AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'REQUEST_CANCELLED',
    'description' => $request->equipment_name.' Request Cancelled'
]);

    return response()->json([
        'message' => 'Request Cancelled',
        'data' => $request
    ]);
}

public function updateStatus(Request $request, $id)
{
    $equipment = EquipmentRequest::findOrFail($id);

    $equipment->update([
        'status' => $request->status
    ]);

    return response()->json([
        'message' => 'Equipment Status Updated',
        'data' => $equipment
    ]);
}

public function failedRequests()
{
    $requests = EquipmentRequest::where(
        'vendor_id',
        auth()->id()
    )
    ->whereIn('status', [

        'Declined',
        'Cancelled',
        'Failed',

        'DECLINED',
        'CANCELLED',
        'FAILED'

    ])
    ->latest()
    ->get();

    return response()->json($requests);
}

}