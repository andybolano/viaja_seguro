<?php

namespace App\Http\Controllers;

use App\Model\Central;
use DB;
use App\Model\Conductor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PdfController extends Controller
{
    public function invoice()
    {
//        $datos = array();
        $data = Conductor::find(3)->usuario;

        if($data != false){
            $pusher = new \Dmitrovskiy\IonicPush\PushProcessor(
                '364e6de6',
                '1fc7897dd96591ed26be9a32da7b268345ce312b91f03d81'
            );

            $devices = array(
                $data->reg_id
            );

            $notification = array(
                'message' => 'Hola probando',
                'title' => 'Notificacion',
                'content' => 'Hola probando'
            );

//            $pusher->notify($devices, $notification);

            return $pusher->notify($devices, $notification);

        } else {
            return 'No existe el usuario';
        }
    }
}
