<?php

namespace App\Http\Controllers;

use App\Models\Catalogue;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
public function dashboard()
{
    $vendorId = auth()->id();

    // PRODUCTS
    $totalProducts = Catalogue::where('vendor_id', $vendorId)->count();

    $activeProducts = Catalogue::where('vendor_id', $vendorId)
        ->where('status', 'ACTIVE')
        ->count();

    $outOfStock = Catalogue::where('vendor_id', $vendorId)
    ->whereRaw('stock_qty <= 0')
    ->count();

    // ORDERS
    $totalOrders = Order::where('vendor_id', $vendorId)->count();

    $pendingOrders = Order::where('vendor_id', $vendorId)
    ->where('status', '!=', 'COMPLETED')
    ->count();

    $completedOrders = Order::where('vendor_id', $vendorId)
        ->where('status', 'COMPLETED')
        ->count();

    // REVENUE
    $totalRevenue = Order::where('vendor_id', $vendorId)
        ->where('status', 'COMPLETED')
        ->sum('total_price');

    // VENDOR INFO
    $vendor = auth()->user();

    // REVIEWS (if table exists)
    $totalReviews = DB::table('reviews')
        ->where('vendor_id', $vendorId)
        ->count();

    $averageRating = DB::table('reviews')
        ->where('vendor_id', $vendorId)
        ->avg('rating');

    return response()->json([
        'vendor_name' => $vendor->name ?? 'N/A',

        'total_products' => $totalProducts,
        'active_products' => $activeProducts,
        'out_of_stock_products' => $outOfStock,

        'total_orders' => $totalOrders,
        'pending_orders' => $pendingOrders,
        'completed_orders' => $completedOrders,

        'total_revenue' => round($totalRevenue, 2),

        'total_reviews' => $totalReviews ?? 0,
        'average_rating' => round($averageRating ?? 0, 1),
        
    ]);
}

    public function vendorEarnings()
    {
        $vendorId = auth()->id();

        $earnings = Order::where(
            'vendor_id',
            $vendorId
        )
        ->where(
            'status',
            'COMPLETED'
        )
        ->sum('total_price');

        return response()->json([
            'total_earnings' => $earnings
        ]);
    }

    public function analytics()
{
    $vendorId = auth()->id();

    $totalProducts = Catalogue::where(
        'vendor_id',
        $vendorId
    )->count();

    $activeProducts = Catalogue::where(
        'vendor_id',
        $vendorId
    )
    ->where(
        'status',
        'ACTIVE'
    )
    ->count();

    $outOfStock = Catalogue::where(
        'vendor_id',
        $vendorId
    )
    ->where(
        'stock_qty',
        0
    )
    ->count();

    $totalOrders = Order::where(
        'vendor_id',
        $vendorId
    )->count();

    $completedOrders = Order::where(
        'vendor_id',
        $vendorId
    )
    ->where(
        'status',
        'COMPLETED'
    )
    ->count();

    $revenue = Order::where(
        'vendor_id',
        $vendorId
    )
    ->where(
        'status',
        'COMPLETED'
    )
    ->sum('total_price');

    return response()->json([
        'total_products' => $totalProducts,
        'active_products' => $activeProducts,
        'out_of_stock_products' => $outOfStock,
        'total_orders' => $totalOrders,
        'completed_orders' => $completedOrders,
        'total_revenue' => $revenue
    ]);
}
public function monthlyEarnings()
{
    $vendorId = auth()->id();

    $earnings = Order::where(
        'vendor_id',
        $vendorId
    )
    ->where(
        'status',
        'COMPLETED'
    )
    ->selectRaw("
        MONTHNAME(created_at) as month,
        SUM(total_price) as earnings
    ")
    ->groupByRaw("MONTH(created_at), MONTHNAME(created_at)")
    ->orderByRaw("MONTH(created_at)")
    ->get();

    return response()->json($earnings);
}

public function topSellingProducts()
{
    $vendorId = auth()->id();

    $products = Order::join(
        'catalogues',
        'orders.catalogue_id',
        '=',
        'catalogues.id'
    )
    ->where(
        'orders.vendor_id',
        $vendorId
    )
    ->select(
        'catalogues.product_name',
        DB::raw('COUNT(orders.id) as total_orders'),
        DB::raw('SUM(orders.quantity) as total_quantity'),
        DB::raw('SUM(orders.total_price) as total_sales')
    )
    ->groupBy(
        'catalogues.product_name'
    )
    ->orderByDesc(
        'total_sales'
    )
    ->get();

    return response()->json($products);
}

public function salesReport()
{
    $vendorId = auth()->id();

    $report = Order::where('vendor_id', $vendorId)
        ->selectRaw("
            COUNT(*) as total_orders,
            SUM(quantity) as total_items_sold,
            SUM(total_price) as total_sales
        ")
        ->first();

    return response()->json([
        'data' => $report
    ]);
}

}