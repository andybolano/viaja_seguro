<?php

namespace App\Http\Controllers;
use App\Events\NuevaSolicitudEvent;
use App\Model\Central;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Vinkla\Pusher\PusherManager;
use Illuminate\Routing\Controller;
use Vinkla\Pusher\Facades\Pusher;
use DB;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use Illuminate\Support\Facades\App;
use App\Model\Solicitud;
use App\Model\Ruta;

class PdfController extends Controller
{
    protected $pusher;

    public function __construct(PusherManager $pusher)
    {
        $this->pusher = $pusher;
    }

    public function bar()
    {
        $this->pusher->trigger('solicitudes', 'NuevaSolicitudEvent', ['message' => 'La prueba']);
    }
    public function invoice()
    {
//        \App::make('\App\Events\NuevaSolicitudEvent')->enviarNotificacion('algo', 'Un cliente a actualizado el estado de su solicitud a', 2);
        $i = 0;
        $solicitud = Solicitud::find(4)->load('datos_pasajeros');
        $solicitud['ruta'] = Ruta::find($solicitud->ruta_id);
        $solicitud['ruta']['destino'] = Central::find($solicitud['ruta']->id_central_destino)->ciudad;
        $solicitud['conductores'] = Ruta::find($solicitud->ruta_id)->turnos->load('conductor');
        $solicitud['conductores']->load('vehiculo');
        foreach($solicitud['conductores'] as $cupos){
            list($total) = DB::table('vehiculos')->select(
                DB::raw('( (cupos) - (select count(conductor_id) from pasajeros where conductor_id ='.$cupos->conductor_id.' and estado = "En ruta") ) as total'))
                ->where('conductor_id', $cupos->conductor_id)->get('total');
            $solicitud['conductores'][$i]['cupos'] = $total->total;
            $i++;
        }
        return JsonResponse::create($solicitud);
    }
}
