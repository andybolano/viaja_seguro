<?php

namespace App\Http\Controllers;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Vinkla\Pusher\PusherManager;
use Illuminate\Routing\Controller;
use Vinkla\Pusher\Facades\Pusher;
use DB;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use Illuminate\Support\Facades\App;


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
        \App::make('\App\Events\EliminarSolicitudEvent')->enviarNotificacion('Eliminar', 'Existe una nueva solicitud',2 );



//        $pusher = \App::make('pusher');
//
//        return array($pusher->trigger( 'solicitudes',
//            'NuevaSolicitudEvent',
//            array('message' => 'Preparing the Pusher Laracon.eu workshop!')));


//        $reg_id = Conductor::find(6)->usuario;
//
//        $regId=$reg_id->reg_id;
//        $msg='Se te asigno un nuevo pasajero';
//        $message = array(
//            "title" => 'Viaja seguro',
//            "message" => $msg,
//            "sound" => 1,
//            "tipo" => 'Pasajeros',
//            "subtitle" => 'Pasajeros'
//        );
//        $regArray[]=$regId;
//        $url = 'https://android.googleapis.com/gcm/send';
//
//        $fields = array('registration_ids' => $regArray, 'data' => $message,);
//        $headers = array( 'Authorization: key=AIzaSyApNpUuEY-iXEdTJKrzMxLEuwWNvskeGvU','Content-Type: application/json');
//
//        $ch = curl_init();
//
//        curl_setopt($ch, CURLOPT_URL, $url);
//        curl_setopt($ch, CURLOPT_POST, true);
//        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
//
//        $result=curl_exec($ch);
//        curl_close($ch);
//        return array($result, $reg_id);
    }

//    public function __construct($text)
//    {
//        $this->text = $text;
//    }
//
//    /**
//     * Get the channels the event should broadcast on.
//     *
//     * @return array
//     */
//    public function broadcastOn()
//    {
//        return ['ubicaciones'];
//    }
}
