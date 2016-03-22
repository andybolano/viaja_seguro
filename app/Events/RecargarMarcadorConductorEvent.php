<?php

namespace App\Events;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Vinkla\Pusher\PusherManager;

class RecargarMarcadorConductorEvent extends Event
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
    public function broadcastOn($conductor_id, $latitud, $longitud)
    {
        $this->pusher->trigger('marcadores', 'RecargarMarcadorConductorEvent', ['datos' => $conductor_id, 'latitud' => $latitud, 'longitud' => $longitud]);
    }
}
