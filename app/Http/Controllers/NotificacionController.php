<?php namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Model\Conductor;

class NotificacionController extends Controller
{
    function enviarNotificacion($mensaje, $conductor_id, $tipo)
    {
        //llamar al usuario
        $reg_id = Conductor::find($conductor_id)->usuario;

        if($reg_id != false){

            $device_token=$reg_id->reg_id;
            $url = 'https://push.ionic.io/api/v1/push';

            $data = array(
                'tokens' => array($device_token),
                'notification' => array(
                    'alert' => $mensaje,
                    'tipo' => $tipo,
                    'ios'=>array(
                        'tipo' => $tipo,
                        'badge'=>1,
                        'sound'=>'ping.aiff',
                        'expiry'=> 1423238641,
                        'priority'=> 10,
                        'contentAvailable'=> true,
                        'payload'=> array(
                            'message'=> $mensaje,
                            'title'=> 'Viaja Seguro',
                            'subtitle' => $tipo
                        ),
                    ),
                    'android'=> array(
                        'tipo' => $tipo,
                        'collapseKey'=>'foo',
                        'delayWhileIdle'=> true,
                        'timeToLive'=> 300,
                        'payload'=> array(
                            'message' => $mensaje,
                            'title' => 'Viaja Seguro',
                            'subtitle' => $tipo,
                            'vibrate' => 1,
                            'sound' => 1,
                            'largeIcon' => 'large_icon',
                            'smallIcon' => 'small_icon'
                        ),
                    ),
                ),
            );

            $content = json_encode($data);
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
            curl_setopt($ch, CURLOPT_USERPWD, "457235565b901aee2242123a43ccbe6f14c3cca2a7181fbf" . ":" );
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'X-Ionic-Application-Id: 759cdf23'
            ));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $result = curl_exec($ch);
//            var_dump($result);
            curl_close($ch);
            return $result;
        } else {
            return 'No existe el conductor';
        }
    }
}