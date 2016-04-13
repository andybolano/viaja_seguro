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
    public function invoice()
    {
        $cliente_id = 7;
        $mensaje = 'Marica';
        $tipo = 'Una vaina';

        $devices = null;
        $device_token = null;
        $reg_id = '';
        //llamar al usuario
        if(is_array($cliente_id)){
            $devices = $cliente_id;
            $reg_id = true;
        }else{
            $reg_id = Cliente::find($cliente_id);
            if($reg_id){
                $reg_id->load('usuario');
                $device_token = $reg_id->usuario->reg_id;;
            }else{
                $reg_id = Cliente::where('identificacion', $cliente_id)->first()->usuario;
                $device_token = $reg_id->reg_id;;
            }
        }

        if($reg_id != false){
            if($devices){
                $regId=$devices;
                $regArray=$regId;
            }else{
                $regId=$device_token;
                $regArray[]=$regId;
            }
            $msg=$mensaje;
            $message = array(
                "title" => 'Viaja seguro',
                "message" => $msg,
                "sound" => 1,
                "tipo" => $tipo,
                "subtitle" => $tipo
            );
            $url = 'https://android.googleapis.com/gcm/send';

            $fields = array('registration_ids' => $regArray, 'data' => $message,);
            $headers = array( 'Authorization: key=AIzaSyApNpUuEY-iXEdTJKrzMxLEuwWNvskeGvU','Content-Type: application/json');

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

            $result=curl_exec($ch);
            curl_close($ch);
            return $result;
        } else {
            return 'No existe el conductor';
        }
    }
}
