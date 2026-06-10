<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VendorAuthController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\EquipmentRequestController;
use App\Http\Controllers\CatalogueController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DispatchHistoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DisputeController;
use App\Http\Controllers\AuditLogController;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post(
    '/register',
    [VendorAuthController::class,'register']
);

Route::post(
    '/login',
    [VendorAuthController::class,'login']
);


/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function(){

    /*
    |--------------------------------------------------------------------------
    | Vendor
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/profile',
        [VendorAuthController::class,'profile']
    );

    Route::post(
        '/logout',
        [VendorAuthController::class,'logout']
    );

    Route::get(
        '/vendor-profile',
        [VendorController::class,'profile']
    );

    Route::post(
    '/vendor-location',
    [VendorController::class,'updateLocation']
);

Route::get(
    '/audit-logs',
    [AuditLogController::class,'index']
);

Route::get(
    '/nearby-vendors',
    [VendorController::class,'nearbyVendors']
);

Route::get(
    '/search-vendor',
    [VendorController::class,'searchVendor']
);

Route::get(
    '/top-rated-vendors',
    [VendorController::class,'topRatedVendors']
);

Route::get(
    '/vendor-details/{id}',
    [VendorController::class,'vendorDetails']
);
    Route::post(
        '/vendor-update',
        [VendorController::class,'updateProfile']
    );

    // Vendor Rating API
    Route::get(
        '/vendor-rating/{id}',
        [VendorController::class,'vendorRating']
    );

    // Dashboard API

    Route::get(
    '/dashboard',
    [DashboardController::class,'dashboard']
);
    Route::get(
    '/vendor-earnings',
    [DashboardController::class,'vendorEarnings']
);

Route::get(
    '/analytics',
    [DashboardController::class,'analytics']
);

Route::get(
    '/top-selling-products',
    [DashboardController::class,'topSellingProducts']
);

Route::get(
    '/sales-report',
    [DashboardController::class,'salesReport']
);

Route::get(
    '/monthly-earnings',
    [DashboardController::class,'monthlyEarnings']
);

    // Vendor Online / Offline Status
    Route::post(
        '/vendor-online-status',
        [VendorController::class,'updateOnlineStatus']
    );


    /*
|--------------------------------------------------------------------------
| Disputes
|--------------------------------------------------------------------------
*/

Route::post(
    '/dispute-add',
    [DisputeController::class,'store']
);

Route::get(
    '/dispute-list',
    [DisputeController::class,'index']
);

Route::get(
    '/dispute/{id}',
    [DisputeController::class,'show']
);

Route::post(
    '/dispute-resolve/{id}',
    [DisputeController::class,'resolve']
);

Route::delete(
    '/dispute-delete/{id}',
    [DisputeController::class,'destroy']
);
    /*
|--------------------------------------------------------------------------
| Dispatch History
|--------------------------------------------------------------------------
*/

Route::post(
    '/dispatch-add',
    [DispatchHistoryController::class,'store']
);

Route::get(
    '/dispatch-list',
    [DispatchHistoryController::class,'index']
);

Route::get(
    '/dispatch/{id}',
    [DispatchHistoryController::class,'show']
);

Route::delete(
    '/dispatch-delete/{id}',
    [DispatchHistoryController::class,'destroy']
);

    /*
    |--------------------------------------------------------------------------
    | Equipment Requests
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/equipment-request',
        [EquipmentRequestController::class,'store']
    );

    Route::get(
        '/equipment-list',
        [EquipmentRequestController::class,'index']
    );

    Route::get(
        '/equipment/{id}',
        [EquipmentRequestController::class,'show']
    );

    Route::post('/equipment-status/{id}',
    [EquipmentRequestController::class,'updateStatus']
);

    Route::delete(
        '/equipment-delete/{id}',
        [EquipmentRequestController::class,'destroy']
    );

    // Equipment Status Workflow

Route::post(
    '/request-accept/{id}',
    [EquipmentRequestController::class,'accept']
);

Route::post(
    '/request-decline/{id}',
    [EquipmentRequestController::class,'decline']
);

Route::post(
    '/request-progress/{id}',
    [EquipmentRequestController::class,'progress']
);

Route::post(
    '/request-complete/{id}',
    [EquipmentRequestController::class,'complete']
);

Route::post(
    '/request-cancel/{id}',
    [EquipmentRequestController::class,'cancel']
);

Route::get(
    '/failed-requests',
    [EquipmentRequestController::class,'failedRequests']
);


    /*
    |--------------------------------------------------------------------------
    | Catalogue
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/catalogue-add',
        [CatalogueController::class,'store']
    );

    Route::get(
        '/catalogue-list',
        [CatalogueController::class,'index']
    );

    Route::get(
        '/catalogue/{id}',
        [CatalogueController::class,'show']
    );

    Route::get(
    '/search-product',
    [CatalogueController::class,'searchProduct']
);

Route::get(
    '/featured-products',
    [CatalogueController::class,'featuredProducts']
);

Route::get(
    '/vendor-products/{id}',
    [CatalogueController::class,'vendorProducts']
);

Route::post(
    '/catalogue-order',
    [OrderController::class,'catalogueOrder']
);

Route::get(
    '/catalogue-order/{id}',
    [OrderController::class,'catalogueOrderDetails']
);
Route::post(
    '/catalogue-status/{id}',
    [CatalogueController::class,'updateStatus']
);

Route::get(
    '/my-products',
    [CatalogueController::class,'myProducts']
);

    // Update Product
    Route::post(
        '/catalogue-update/{id}',
        [CatalogueController::class,'update']
    );

    // Delete Product
    Route::delete(
        '/catalogue-delete/{id}',
        [CatalogueController::class,'destroy']
    );

    Route::post(
    '/stock-increase/{id}',
    [CatalogueController::class,'increaseStock']
);

Route::post(
    '/stock-decrease/{id}',
    [CatalogueController::class,'decreaseStock']
);

Route::get(
    '/low-stock-products',
    [CatalogueController::class,'lowStockProducts']
);

Route::get(
    '/out-of-stock-products',
    [CatalogueController::class,'outOfStockProducts']
);


    /*
    |--------------------------------------------------------------------------
    | Orders
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/order-add',
        [OrderController::class,'store']
    );

    Route::get(
        '/order-list',
        [OrderController::class,'index']
    );

    Route::get(
    '/order-history',
    [OrderController::class,'orderHistory']
);

    Route::get(
        '/order/{id}',
        [OrderController::class,'show']
    );

    Route::post(
        '/order-status/{id}',
        [OrderController::class,'updateStatus']
    );


    /*
    |--------------------------------------------------------------------------
    | Reviews
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/review-add',
        [ReviewController::class,'store']
    );

    Route::get(
        '/review-list',
        [ReviewController::class,'index']
    );

    Route::get(
        '/review/{id}',
        [ReviewController::class,'show']
    );

    Route::delete(
        '/review-delete/{id}',
        [ReviewController::class,'destroy']
    );

    Route::get(
    '/completed-orders',
    [ReviewController::class,'completedOrders']
);

    Route::get(
    '/vendor-reviews/{id}',
    [ReviewController::class,'vendorReviews']
);

        /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/notification-add',
        [NotificationController::class,'store']
    );

    Route::get(
        '/notification-list',
        [NotificationController::class,'index']
    );

    Route::post(
        '/notification-read/{id}',
        [NotificationController::class,'markAsRead']
    );

    Route::get(
        '/notification-unread-count',
        [NotificationController::class,'unreadCount']
    );

});