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
        $data = Conductor::find(4)->usuario;
        if($data != false){

            $apiKey = 'd1590f03bd4e47ee5dda7beff6947418130aa9374871b231';

            $userIdentificador = $data->reg_id;

            $headers = array('Authorization:key=' . $apiKey);
            $data = array(
                'registration_ids' => $userIdentificador,
                'collapse_key' => '',
                'data.messages' => 'Estamos probando el sistema',
                'data.fecha' => date('Y-m-d'));

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send");
            if ($headers)
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if (curl_errno($ch)) {
                return 'fail';
            }
            if ($httpCode != 200) {
                return $data;
            }
            curl_close($ch);
            return $response;
        } else {
            return 'No existe el usuario';
        }
    }


    public function getData()
    {
        $data =  [
            'quantity'      => '1' ,
            'description'   => 'some ramdom text',
            'price'   => '500',
            'total'     => '500'
        ];
        return $data;
    }
}
