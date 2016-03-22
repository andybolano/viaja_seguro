<?php

namespace App\Events;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Vinkla\Pusher\PusherManager;

class UpdatedEstadoConductorEvent extends Event
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
    public function enviarNotificacion($tipo, $message, $conductor, $central_id)
    {
        $this->pusher->trigger('notificaciones', 'UpdatedEstadoConductorEvent',
            [
                'tipo' => $tipo,
                'message' => $message,
                'conductor' => $conductor,
                'central_id' => $central_id
            ]);
    }
}
