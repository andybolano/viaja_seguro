<?php

namespace App\Events;
use App\Model\Solicitud;
use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Vinkla\Pusher\PusherManager;

class NuevaSolicitudEvent
{
    use SerializesModels;
    public $pusher;
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
    public function enviarNotificacion($tipo, $message, $central_id)
    {
        $this->pusher->trigger('solicitudes', 'NuevaSolicitudEvent', ['tipo' => $tipo, 'message' => $message, 'central_id' => $central_id]);
    }
}
