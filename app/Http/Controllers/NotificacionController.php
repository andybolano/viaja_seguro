<?php namespace App\Http\Controllers;

use App\Model\Cliente;
use Illuminate\Http\JsonResponse;
use App\Model\Conductor;

class NotificacionController extends Controller
{
    function enviarNotificacionConductores($mensaje, $conductor_id, $tipo, $datos = null)
    {
        $devices = null;
        $device_token = null;
        $reg_id = '';
        //llamar al usuario
        if(is_array($conductor_id)){
            $devices = $conductor_id;
            $reg_id = true;
        }else{
            $reg_id = Conductor::find($conductor_id)->usuario;
            $device_token = $reg_id->reg_id;
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
                "subtitle" => $tipo,
                "datos" => $datos
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

    function enviarNotificacionClientes($mensaje, $cliente_id, $tipo)
    {
        $devices = null;
        $device_token = null;
        $reg_id = '';
        //llamar al usuario
        if(is_array($cliente_id)){
            $devices = $cliente_id;
            $reg_id = true;
        }else{
            $reg_id = Cliente::find($cliente_id)->usuario;
            $device_token = $reg_id->reg_id;;
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