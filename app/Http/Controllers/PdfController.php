<?php

namespace App\Http\Controllers;

use App\Model\Central;
use App\Model\Pasajero;
use DB;
use App\Model\Conductor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Psy\Util\Json;

class PdfController extends Controller
{
    public function invoice()
    {
        $conductores = \DB::table('usuarios')->select('reg_id')->where('rol_id', 4)->where('reg_id', '!=','')->get();
        $i =0;
        $reg_ids = [];
        foreach($conductores as $reg_id){
            $reg_ids[$i] = $reg_id->reg_id;
            $i++;
        }

        if(is_array($reg_ids)){
            $devices = $reg_ids;
        }else{
            $device_token = 'No es el array';
        }

        if(!$devices){
            $regId=$devices;
        }else{
            $regId=$device_token;
        }
        return $regId;


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
}
