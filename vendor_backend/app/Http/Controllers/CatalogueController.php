<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Catalogue;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Storage;

class CatalogueController extends Controller
{
    // Add Product
    public function store(Request $request)
    {
        $request->validate([
    'product_name' => 'required',
    'price' => 'required|numeric',
    'description' => 'nullable',
    'category' => 'nullable|string',
    'stock_qty' => 'nullable|integer',
    'min_order_qty' => 'nullable|integer',
    'delivery_option' => 'nullable|string',
    'status' => 'nullable|string',
    'images' => 'nullable|array|max:5',
    'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:4096'
]);

$imagePaths = [];

if($request->hasFile('images'))
{
    foreach($request->file('images') as $image)
    {
        $imagePaths[] = $image->store(
            'catalogues',
            'public'
        );
    }
}

        $catalogue = Catalogue::create([
            'vendor_id' => auth()->id(),
            'product_name' => $request->product_name,
            'price' => $request->price,
            'description' => $request->description,

            'category' => $request->category,
            'stock_qty' => $request->stock_qty ?? 0,
            'min_order_qty' => $request->min_order_qty ?? 1,
            'delivery_option' => match(strtolower($request->delivery_option ?? 'both')) {
            'pickup' => 'SELF_PICKUP',
            'delivery' => 'LOCAL_DELIVERY',
            'both' => 'BOTH',
            default => 'BOTH'
            },

'status' => match(strtolower($request->status ?? 'active')) {
    'active' => 'ACTIVE',
    'inactive' => 'INACTIVE',
    'out_of_stock' => 'OUT_OF_STOCK',
    'pending_review' => 'PENDING_REVIEW',
    default => 'ACTIVE'
},
            'images' => $imagePaths
        ]);
        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'PRODUCT_ADDED',
    'description' => $catalogue->product_name.' Product Added'
]);

        return response()->json([
            'message' => 'Catalogue Added',
            'data' => $catalogue,
            'image_urls' => collect(
    $catalogue->images ?? []
)->map(function ($img) {
    return asset('storage/' . $img);
})
        ]);
    }

    // All Products
    public function index()
    {
        $catalogues = Catalogue::latest()->get()->map(function ($item) {

            $item->image_urls = collect(
    $item->images ?? []
)->map(function ($img) {
    return asset('storage/' . $img);
});

            return $item;
        });

        return response()->json($catalogues);
    }

    // Single Product
    public function show($id)
    {
        $catalogue = Catalogue::findOrFail($id);

        $catalogue->image_urls = collect(
    $catalogue->images ?? []
)->map(function ($img) {
    return asset('storage/' . $img);
});

        return response()->json($catalogue);
    }

    // Delete Product
    public function destroy($id)
    {
        $catalogue = Catalogue::findOrFail($id);

        foreach($catalogue->images ?? [] as $image)
{
    Storage::disk('public')->delete($image);
}

        $productName = $catalogue->product_name;

        $catalogue->delete();

        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'PRODUCT_DELETED',
    'description' => $productName.' Product Deleted'
]);

        return response()->json([
            'message' => 'Deleted Successfully'
        ]);
    }

    // Update Product
    public function update(Request $request, $id)
    {
        $catalogue = Catalogue::findOrFail($id);

        $request->validate([
    'images' => 'nullable|array|max:5',
    'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:4096'
]);

if($request->hasFile('images'))
{
    foreach($catalogue->images ?? [] as $oldImage)
    {
        Storage::disk('public')->delete($oldImage);
    }

    $imagePaths = [];

    foreach($request->file('images') as $image)
    {
        $imagePaths[] = $image->store(
            'catalogues',
            'public'
        );
    }

    $catalogue->images = $imagePaths;
}

        $catalogue->product_name =
    $request->product_name ?? $catalogue->product_name;

$catalogue->price =
    $request->price ?? $catalogue->price;

$catalogue->description =
    $request->description ?? $catalogue->description;

$catalogue->category =
    $request->category ?? $catalogue->category;

$catalogue->stock_qty =
    $request->stock_qty ?? $catalogue->stock_qty;

$catalogue->min_order_qty =
    $request->min_order_qty ?? $catalogue->min_order_qty;
        $catalogue->delivery_option = match(strtolower($request->delivery_option ?? 'both')) {
            'pickup' => 'SELF_PICKUP',
            'delivery' => 'LOCAL_DELIVERY',
            'both' => 'BOTH',
            default => 'BOTH'
        };
        $catalogue->status = match(strtolower($request->status ?? 'active')) {
            'active' => 'ACTIVE',
            'inactive' => 'INACTIVE',
            'out_of_stock' => 'OUT_OF_STOCK',
            'pending_review' => 'PENDING_REVIEW',
            default => 'ACTIVE'
        };

        $catalogue->save();

        AuditLog::create([
    'vendor_id' => auth()->id(),
    'action' => 'PRODUCT_UPDATED',
    'description' => $catalogue->product_name.' Product Updated'
]);

        return response()->json([
            'message' => 'Product Updated',
            'data' => $catalogue,
            'image_urls' => collect(
    $catalogue->images ?? []
)->map(function ($img) {
    return asset('storage/' . $img);
})
        ]);
    }

    // Search Product
public function searchProduct(Request $request)
{
    $keyword = $request->keyword;

    $products = Catalogue::where(
        'product_name',
        'like',
        "%{$keyword}%"
    )
    ->get()
    ->map(function ($item) {

        $item->image_urls = collect(
            $item->images ?? []
        )->map(function ($img) {

            return asset('storage/'.$img);

        });

        return $item;
    });

    return response()->json($products);
}

    // Featured Products
public function featuredProducts()
{
    $products = Catalogue::latest()
        ->take(10)
        ->get()
        ->map(function ($item) {

            $item->image_urls = collect(
                $item->images ?? []
            )->map(function ($img) {

                return asset('storage/'.$img);

            });

            return $item;
        });

    return response()->json($products);
}

    // Vendor Products
public function vendorProducts($id)
{
    $products = Catalogue::where(
        'vendor_id',
        $id
    )
    ->latest()
    ->get()
    ->map(function ($item) {

        $item->image_urls = collect(
            $item->images ?? []
        )->map(function ($img) {

            return asset('storage/'.$img);

        });

        return $item;
    });

    return response()->json($products);
}

    // Increase Stock

public function increaseStock(Request $request, $id)
{
    $catalogue = Catalogue::findOrFail($id);

    $qty = (int) $request->quantity;

    if ($qty <= 0) {
        return response()->json([
            'message' => 'Invalid Quantity'
        ], 400);
    }

    $catalogue->stock_qty += $qty;

    if ($catalogue->stock_qty > 0) {
        $catalogue->status = 'ACTIVE';
    }

    $catalogue->save();

    return response()->json([
        'message' => 'Stock Increased',
        'current_stock' => $catalogue->stock_qty
    ]);
}


// Decrease Stock

public function decreaseStock(Request $request, $id)
{
    $catalogue = Catalogue::findOrFail($id);

    $qty = (int) $request->quantity;

    if ($qty <= 0) {
        return response()->json([
            'message' => 'Invalid Quantity'
        ], 400);
    }

    if ($catalogue->stock_qty < $qty) {
        return response()->json([
            'message' => 'Insufficient Stock'
        ], 400);
    }

    $catalogue->stock_qty -= $qty;

    if ($catalogue->stock_qty <= 0) {
        $catalogue->stock_qty = 0;
        $catalogue->status = 'OUT_OF_STOCK';
    }

    $catalogue->save();

    return response()->json([
        'message' => 'Stock Decreased',
        'current_stock' => $catalogue->stock_qty
    ]);
}


// Low Stock Products

public function lowStockProducts()
{
    $products = Catalogue::where(
        'stock_qty',
        '<=',
        10
    )
    ->get()
    ->map(function ($item) {

        $item->image_urls = collect(
            $item->images ?? []
        )->map(function ($img) {

            return asset('storage/'.$img);

        });

        return $item;
    });

    return response()->json($products);
}


// Out Of Stock Products

public function outOfStockProducts()
{
    $products = Catalogue::where(
        'status',
        'OUT_OF_STOCK'
    )
    ->get()
    ->map(function ($item) {

        $item->image_urls = collect(
            $item->images ?? []
        )->map(function ($img) {

            return asset('storage/'.$img);

        });

        return $item;
    });

    return response()->json($products);
}

public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:ACTIVE,INACTIVE,OUT_OF_STOCK'
    ]);

    $product = Catalogue::findOrFail($id);

    $product->status = $request->status;

    $product->save();

    return response()->json([
        'message' => 'Product Status Updated',
        'data' => $product
    ]);
}

public function myProducts()
{
    $products = Catalogue::where(
        'vendor_id',
        auth()->id()
    )
    ->latest()
    ->get()
    ->map(function ($item) {

        $item->image_urls = collect(
            $item->images ?? []
        )->map(function ($img) {

            return asset('storage/'.$img);

        });

        return $item;
    });

    return response()->json($products);
}
}