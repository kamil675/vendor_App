<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VendorNotificationEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function broadcastOn()
{
    \Log::info('Broadcast Fired', $this->data);

    return new Channel('vendor-notifications');
}

    public function broadcastAs()
    {
        return 'vendor.notification';
    }
}