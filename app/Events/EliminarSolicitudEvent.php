<?php

namespace App\Events;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Vinkla\Pusher\PusherManager;

class EliminarSolicitudEvent extends Event
{
    use SerializesModels;
    protected $pusher;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(PusherManager $pusher)
    {
        $this->pusher = $pusher;
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn($tipo, $message, $central_id)
    {
        $this->pusher->trigger('notificaciones', 'EliminarSolicitudEvent', ['tipo' => $tipo, 'message' => $message, 'central_id' => $central_id]);
    }
}
