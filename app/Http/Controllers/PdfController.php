<?php

namespace App\Http\Controllers;

use App\Model\Central;
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
        $reg_id = Conductor::find(4)->usuario;
        $registration_ids = array($reg_id);

        $api_key = "AIzaSyApNpUuEY-iXEdTJKrzMxLEuwWNvskeGvU";// your Google Developers Console Project API key

        $data =  array(
            "message" => 'Hola',
            'title' => 'Notificacion',
        );


        // URL to POST to
        $gcm_url = 'https://android.googleapis.com/gcm/send';

        // data to be posted
        $fields = array('registration_ids' => $registration_ids, 'data' => $data, );

        // headers for the request
        $headers = array('Authorization: key=' . $api_key, 'Content-Type: application/json');

        $curl_handle = curl_init();

        //echo 'Notification PhP file';

        // set CURL options
        curl_setopt($curl_handle, CURLOPT_URL, $gcm_url);

        curl_setopt($curl_handle, CURLOPT_POST, true);
        curl_setopt($curl_handle, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($curl_handle, CURLOPT_POSTFIELDS, json_encode($fields));

        // send
        $response = curl_exec($curl_handle);
        curl_close($curl_handle);

        return JsonResponse::create($response);
    }
}
