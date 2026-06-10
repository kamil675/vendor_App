<?php

namespace App\Http\Controllers;

use App\Models\Dispute;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class DisputeController extends Controller
{
    public function store(Request $request)
    {
        $dispute = Dispute::create([

            'vendor_id' => auth()->id(),
            'order_id' => $request->order_id,
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'OPEN'

        ]);
      
        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'DISPUTE_CREATED',
    'description' => $dispute->title
]);


        return response()->json([
            'message' => 'Dispute Created',
            'data' => $dispute
        ]);
    }

    public function index()
    {
        return Dispute::where(
            'vendor_id',
            auth()->id()
        )->get();
    }

    public function show($id)
    {
        return Dispute::findOrFail($id);
    }

    public function resolve($id)
    {
        $dispute = Dispute::findOrFail($id);

        $dispute->update([
            'status' => 'RESOLVED'
        ]);

        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'DISPUTE_RESOLVED',
    'description' => $dispute->title
]);
        return response()->json([
            'message' => 'Dispute Resolved',
            'data' => $dispute
        ]);
    }

    public function destroy($id)
    {
        $dispute = Dispute::findOrFail($id);

        $title = $dispute->title;
        $dispute->delete();

        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'DISPUTE_DELETED',
    'description' => $title
]);

        return response()->json([
            'message' => 'Dispute Deleted'
        ]);
    }
}