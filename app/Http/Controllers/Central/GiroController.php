<?php

namespace App\Http\Controllers\Central;

use App\Model\Conductor;
use App\Model\Giro;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Model\Central;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class GiroController extends Controller
{
    public function index($conductor_id){
        try{
            $giros = Conductor::find($conductor_id)->giros;
            return $giros;
        }catch(\Exception $e){
            return response()->json(array("exception"=>$e->getMessage()), 400);
        }
    }

    public function create(){

    }

    public function store(Request $request, $central_id){
        try{
            $data = $request->json()->all();
            $giro = new Giro($data);
            Conductor::find($data['conductor_id'])->giros()->save($giro);

            $mensaje = 'Se te asigno un nuevo giro';
            $this->enviarNotificacion('', $mensaje, $data['conductor_id']);

            if(!Central::find($central_id)->giros()->save($giro)){
                $giro->delete();
                return response()->json(['mensajeError' => 'No se ha posido registrar al giro'], 400);
            }
            return JsonResponse::create(array('message' => "Se asigno el giro correctamente"), 200);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
    }

    function enviarNotificacion($collapseKey, $mensaje, $conductor_id)
    {
        //llamar al usuario
        $data = Conductor::find($conductor_id)->usuario;

        if($data != false){

            $apiKey = 'AIzaSyAZB5qS20uH0-W_btPvbLRx_D2qFHnNCt8';

            $userIdentificador = $data["reg_id"];

            $headers = array('Authorization:key=' . $apiKey);
            $data = array(
                'registration_ids' => $userIdentificador,
                'collapse_key' => $collapseKey,
                'data.message' => $mensaje,
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
                return 'status code 200';
            }
            curl_close($ch);
            return $response;
        } else {
            return 'No existe el usuario';
        }
    }

    public function show($id){
        return Giro::find($id);
    }

    public function edit(){

    }

    public function update(Request $request, $id){
        try{
            $data = $request->all();
            $giro = Giro::find($id);
            $giro->nombres = $data['nombres'];
            $giro->telefono = $data['telefono'];
            $giro->ide_remitente = $data['ide_remitente'];
            $giro->nombre_receptor = $data['nombre_receptor'];
            $giro->telefono_receptor = $data['telefono_receptor'];
            $giro->direccion = $data['direccion'];
            $giro->direccionD = $data['direccionD'];

            $giro->monto = $data['monto'];
            if($giro->save() == true){
                return JsonResponse::create(array('message' => "Actualizado Correctamente"), 200);
            }else {
                return JsonResponse::create(array('message' => "No se pudo actualizar el registro"), 200);
            }
        }catch(Exception $e){
            return JsonResponse::create(array('message' => "No se pudo guardar el registro", "exception"=>$e->getMessage()), 401);
        }
    }

    public function destroy($id){
        try{
            $conductor = Giro::find($id)->conductor;
            $giro = Giro::find($id);
            if (is_null ($giro))
            {
                \App::abort(404);
            }else{
                $giro->delete();
                $mensaje = 'Se retiro un giro que se te habia sido asignado';
                $this->enviarNotificacion('', $mensaje, $conductor->id);
                return JsonResponse::create(array('message' => "Giro eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo eliminar el Giro", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

}
