<?php

namespace App\Http\Controllers;
use App\Events\NuevaSolicitudEvent;
use App\Model\Central;
use App\Model\Conductor;
use App\Model\Turno;
use App\Model\Viaje;
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
use App\Model\Cliente;

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

    private function verificarCliente($identificacion)
    {
        return $cliente = Cliente::where('identificacion', $identificacion)->first();

    }

    public function invoice()
    {
        return $ecliente = $this->verificarCliente(1120745953);


//        $noty = new NotificacionController();
//        DB::connection()->enableQueryLog();
//        $viaje = Viaje::find(70);
//        foreach ($viaje->paquetes as $paquete){
//                $viaje['datos']  = DB::table('datos_solicitudes_girospaquetes')
//                    ->join('solicitudes_cliente', 'datos_solicitudes_girospaquetes.solicitud_id', '=', 'solicitudes_cliente.id')
//                    ->join('clientes', 'solicitudes_cliente.cliente_id', '=', 'clientes.id')
//                    ->join('paquetes', 'datos_solicitudes_girospaquetes.destinatario', '=', 'paquetes.nombre_receptor')
//                    ->select('solicitudes_cliente.id', 'solicitudes_cliente.estado', 'solicitudes_cliente.cliente_id', 'clientes.identificacion')
//                    ->where('clientes.identificacion', $paquete->ide_remitente)
//                    ->where('solicitudes_cliente.tipo', 'paquete')
//                    ->where('solicitudes_cliente.estado', '<>', 'f')
//                    ->get();
//        }
//        foreach ($viaje['datos'] as $dato){
//            DB::table('solicitudes_cliente')
//                ->where('id', $dato->id)
//                ->update(['estado' => 'f']);
//            $noty->enviarNotificacionClientes('Finalizo su solicitud, gracias por haber echo uso de nuestro servicio', $dato->cliente_id, 'Finalizado');
//        }
//        $query = DB::getQueryLog();
//        $lastQuery = end($query);
//        print_r($lastQuery);
//        return JsonResponse::create($viaje['datos']);
    }
}
