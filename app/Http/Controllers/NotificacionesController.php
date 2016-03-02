<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificacionesController extends Controller
{
    function sendMessageToPhone($collapseKey, $messageText, $username)
    {
        //llamar al usuario


        $user = new users();
        $data = $user->getUser($username);
        if($data != false){

            $apiKey = 'AIzaSyBxy1d7BwmTE1Wcy1PyucThSBPVKDhdeow⁠⁠⁠⁠';

            $userIdentificador = $data["reg_id"];

            $headers = array('Authorization:key=' . $apiKey);
            $data = array(
                'registration_ids' => $userIdentificador,
                'collapse_key' => $collapseKey,
                'data.message' => $messageText);

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
                return 'status code 200';
            }
            curl_close($ch);
            return $response;
        } else {
            return 'No existe el usuario';
        }
    }
}