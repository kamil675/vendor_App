<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\AuditLog;
use App\Models\Catalogue;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{

    public function store(Request $request)
    {
        $catalogue = Catalogue::find($request->catalogue_id);

        if (!$catalogue) {
            return response()->json([
                'message' => 'Product Not Found'
            ], 404);
        }

        $totalPrice = $catalogue->price * $request->quantity;

        $order = Order::create([

            'vendor_id'    => Auth::id(),
            'catalogue_id' => $request->catalogue_id,
            'quantity'     => $request->quantity,
            'total_price'  => $totalPrice,
            'status'       => 'PENDING'

        ]);

        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'ORDER_CREATED',
    'description' => 'Order #'.$order->id.' Created'
]);

        return response()->json([

            'message' => 'Order Created',
            'data'    => $order

        ]);
    }


    public function index()
{
    return Order::where(
        'vendor_id',
        auth()->id()
    )
    ->latest()
    ->get();
}


    public function show($id)
    {
        return Order::find($id);
    }


    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {

            return response()->json([
                'message' => 'Order Not Found'
            ], 404);
        }

        $order->status = strtoupper($request->status);

        $order->save();

        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'ORDER_STATUS_UPDATED',
    'description' => 'Order #'.$order->id.' Status '.$order->status
]);

        return response()->json([

            'message' => 'Status Updated',
            'data'    => $order

        ]);
    }


    public function orderHistory()
{
    return Order::where(
        'vendor_id',
        auth()->id()
    )
    ->latest()
    ->get();
}

    public function catalogueOrder(Request $request)
{
    return $this->store($request);
}

public function catalogueOrderDetails($id)
{
    return $this->show($id);
}
}