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
            $msg = 'Hola esto es la prueba';

            $device_token=$data->reg_id;


            $url = 'https://push.ionic.io/api/v1/push';

            $data = array(
                'tokens' => array($device_token),
                'notification' => array('alert' => $msg),
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
            $result = curl_exec($ch);
            curl_close($ch);
            return $result;

        } else {
            return 'No existe el usuario';
        }
    }
}
