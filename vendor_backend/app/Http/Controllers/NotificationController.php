<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AppNotification;
use App\Events\VendorNotificationEvent;

class NotificationController extends Controller
{
    // Add Notification
    public function store(Request $request)
    {
        $notification = AppNotification::create([
            'vendor_id' => auth()->id(),
            'title' => $request->title,
            'message' => $request->message,
            'is_read' => false
        ]);
        event(
    new VendorNotificationEvent(
        $notification
    )
);

        return response()->json([
            'message' => 'Notification Created',
            'data' => $notification
        ]);
    }

    // Notification List
    public function index()
    {
        return response()->json(
            AppNotification::where(
                'vendor_id',
                auth()->id()
            )
            ->latest()
            ->get()
        );
    }

    // Mark As Read
    public function markAsRead($id)
    {
        $notification = AppNotification::findOrFail($id);

        $notification->update([
            'is_read' => true
        ]);

        return response()->json([
            'message' => 'Notification Marked As Read',
            'data' => $notification
        ]);
    }

    // Unread Count
    public function unreadCount()
    {
        $count = AppNotification::where(
            'vendor_id',
            auth()->id()
        )
        ->where(
            'is_read',
            false
        )
        ->count();

        return response()->json([
            'unread_count' => $count
        ]);
    }
}