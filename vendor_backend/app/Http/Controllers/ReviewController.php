<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // Add Review
    public function store(Request $request)
    {
        $order = Order::where('vendor_id',$request->vendor_id)
            ->where('status','COMPLETED')
            ->exists();

if(!$order)
{
    return response()->json([
        'message'=>'Completed order required'
    ],400);
}
        
        $request->validate([
            'order_id'=>'required',
            'rating'=>'required',
            'comment'=>'required'
        ]);

        $order = Order::find($request->order_id);

if(!$order)
{
    return response()->json([
        'message' => 'Order Not Found'
    ],404);
}

$existingReview = Review::where(
    'order_id',
    $request->order_id
)->first();

if($existingReview)
{
    return response()->json([
        'message' => 'Review Already Submitted'
    ],400);
}

if($order->status != 'COMPLETED')
{
    return response()->json([
        'message' => 'Review Allowed Only For Completed Orders'
    ],400);
}

        $review = Review::create([
            'vendor_id'=>Auth::id(),
            'order_id'=>$request->order_id,
            'rating'=>$request->rating,
            'comment'=>$request->comment
        ]);

        return response()->json([
            'message'=>'Review Added',
            'data'=>$review
        ]);
    }

    // Review List
    public function index()
    {
        return Review::all();
    }

    // Single Review
    public function show($id)
    {
        return Review::findOrFail($id);
    }

    // Delete Review
    public function destroy($id)
    {
        Review::findOrFail($id)->delete();

        return response()->json([
            'message'=>'Deleted Successfully'
        ]);
    }

    public function vendorReviews($id)
{
    $reviews = Review::where(
        'vendor_id',
        $id
    )->latest()->get();

    return response()->json($reviews);
}

public function completedOrders()
{
    $orders = Order::where(
        'vendor_id',
        auth()->id()
    )
    ->where(
        'status',
        'COMPLETED'
    )
    ->latest()
    ->get();

    return response()->json($orders);
}
}