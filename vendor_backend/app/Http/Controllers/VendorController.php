<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Order;
use App\Models\Catalogue;
use Illuminate\Support\Facades\Storage;

class VendorController extends Controller
{
public function profile()
{
    $vendor = auth()->user();

    return response()->json([
        'id' => $vendor->id,
        'name' => $vendor->name,
        'email' => $vendor->email,
        'phone' => $vendor->phone,
        'shop_name' => $vendor->shop_name,
        'address' => $vendor->address,
        'latitude' => $vendor->latitude,
        'longitude' => $vendor->longitude,
        'is_online' => $vendor->is_online,
        'rating' => $vendor->rating,
        'created_at' => $vendor->created_at,
        'updated_at' => $vendor->updated_at,

        'image' => $vendor->image,

        'image_url' => $vendor->image
            ? asset('storage/' . $vendor->image)
            : null,
    ]);
}

public function updateProfile(Request $request)
{
    $request->validate([
        'name' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:20',
        'shop_name' => 'nullable|string|max:255',
        'address' => 'nullable|string|max:500',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $vendor = auth()->user();

    if (!$vendor) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 401);
    }

    // Image Upload
    if ($request->hasFile('image')) {

        // delete old image (optional but production best)
        if ($vendor->image && file_exists(storage_path('app/public/' . $vendor->image))) {
            unlink(storage_path('app/public/' . $vendor->image));
        }

        $imagePath = $request->file('image')->store('vendors', 'public');
        $vendor->image = $imagePath;
    }

    if ($request->name) $vendor->name = $request->name;
    if ($request->phone) $vendor->phone = $request->phone;
    if ($request->shop_name) $vendor->shop_name = $request->shop_name;
    if ($request->address) $vendor->address = $request->address;

    $vendor->save();

    return response()->json([
        'message' => 'Profile Updated Successfully',
        'data' => $vendor,
        'image_url' => $vendor->image
            ? asset('storage/' . $vendor->image)
            : null
    ]);
}

    public function vendorRating($id)
{
    $vendor = Vendor::find($id);

    if(!$vendor)
    {
        return response()->json([
            'message' => 'Vendor not found'
        ],404);
    }

    $reviews = Review::where('vendor_id',$id)->get();

    $averageRating = Review::where('vendor_id',$id)
                        ->avg('rating');

    return response()->json([
        'vendor_id' => $vendor->id,
        'vendor_name' => $vendor->name,
        'average_rating' => round($averageRating,1),
        'total_reviews' => $reviews->count(),
        'reviews' => $reviews
    ]);
}

public function dashboard()
{
    $vendor = auth()->user();

    // Orders
    $totalOrders = Order::where('vendor_id',$vendor->id)->count();

    $completedOrders = Order::where('vendor_id',$vendor->id)
                            ->where('status','Completed')
                            ->count();

    $pendingOrders = Order::where('vendor_id',$vendor->id)
                            ->where('status','Pending')
                            ->count();

    // Products
    $totalProducts = Catalogue::where('vendor_id',$vendor->id)->count();

    // Reviews
    $totalReviews = Review::where('vendor_id',$vendor->id)->count();

    $averageRating = Review::where('vendor_id',$vendor->id)
                            ->avg('rating');

    // Revenue
    $revenue = Order::where('vendor_id',$vendor->id)
                    ->where('status','Completed')
                    ->sum('total_price');

    return response()->json([
        'vendor_id' => $vendor->id,
        'vendor_name' => $vendor->name,
        'total_orders' => $totalOrders,
        'completed_orders' => $completedOrders,
        'pending_orders' => $pendingOrders,
        'total_products' => $totalProducts,
        'total_reviews' => $totalReviews,
        'average_rating' => round($averageRating,1),
        'revenue' => $revenue
    ]);
}

public function updateOnlineStatus(Request $request)
{
    $vendor = auth()->user();

    $vendor->is_online = $request->is_online;

    $vendor->save();

    return response()->json([
        'message' => 'Online Status Updated',
        'vendor_id' => $vendor->id,
        'is_online' => $vendor->is_online
    ]);
}

public function updateLocation(Request $request)
{
    $request->validate([
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
    ]);

    $vendor = auth()->user();

    if (!$vendor) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 401);
    }

    $vendor->update([
        'latitude' => $request->latitude,
        'longitude' => $request->longitude,
    ]);

    return response()->json([
        'message' => 'Location Updated Successfully',
        'data' => [
            'latitude' => $vendor->latitude,
            'longitude' => $vendor->longitude,
        ]
    ]);
}

public function nearbyVendors()
{
    $vendors = \App\Models\Vendor::whereNotNull('latitude')
        ->whereNotNull('longitude')
        ->select(
            'id',
            'name',
            'shop_name',
            'phone',
            'address',
            'latitude',
            'longitude',
            'rating',
            'is_online',
            'image'
        )
        ->get();

    return response()->json($vendors);
}

public function searchVendor(Request $request)
{
    $keyword = $request->keyword;

    $vendors = \App\Models\Vendor::where(
        'name',
        'like',
        "%{$keyword}%"
    )
    ->orWhere(
        'shop_name',
        'like',
        "%{$keyword}%"
    )
    ->get();

    return response()->json($vendors);
}

public function topRatedVendors()
{
    $vendors = \App\Models\Vendor::orderBy(
        'rating',
        'desc'
    )->take(10)->get();

    return response()->json($vendors);
}

public function vendorDetails($id)
{
    $vendor = Vendor::find($id);

    if (!$vendor) {
        return response()->json([
            'message' => 'Vendor not found'
        ], 404);
    }

    return response()->json([
        'id' => $vendor->id,
        'name' => $vendor->name,
        'email' => $vendor->email,
        'phone' => $vendor->phone,
        'shop_name' => $vendor->shop_name,
        'address' => $vendor->address,
        'latitude' => $vendor->latitude,
        'longitude' => $vendor->longitude,
        'rating' => $vendor->rating,
        'is_online' => $vendor->is_online,
        'image' => $vendor->image
            ? asset('storage/'.$vendor->image)
            : null,
    ]);
}

}