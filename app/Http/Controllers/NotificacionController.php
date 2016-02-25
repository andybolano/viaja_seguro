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
                    'ios'=>array(
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
            curl_setopt($ch, CURLOPT_USERPWD, "1fc7897dd96591ed26be9a32da7b268345ce312b91f03d81" . ":" );
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'X-Ionic-Application-Id: 364e6de6'
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