<?php

namespace App\Http\Controllers\Central;

use App\Model\Conductor;
use App\Model\Paquete;
use App\Model\Pasajero;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Model\Central;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PaqueteController extends Controller
{
    public function index($conductor_id){
        try{
            $paquetes = Conductor::find($conductor_id)->paquetes;
            return $paquetes;
        }catch(\Exception $e){
            return response()->json(array("exception"=>$e->getMessage()), 400);
        }
    }

    public function create(){

    }

    public function store(Request $request, $central_id){
        try{
            $data = $request->json()->all();
            $paquete = new Paquete($data);

            Conductor::find($data['conductor_id'])->paquetes()->save($paquete);

            $mensaje = 'Se te asigno un nuevo paquete';
            $this->enviarNotificacion('', $mensaje, $data['conductor_id']);

            if(!Central::find($central_id)->paquetes()->save($paquete)){
                return response()->json(['mensajeError' => 'No se ha posido registrar al paquete'], 400);
            }
            return response()->json($paquete, 201);
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
        return Paquete::find($id);
    }

    public function edit(){

    }

    public function update(Request $request, $id){
        try{
            $data = $request->all();
            $paquete = Paquete::find($id);
            $paquete->nombres = $data['nombres'];
            $paquete->telefono = $data['telefono'];
            $paquete->ide_remitente = $data['ide_remitente'];
            $paquete->nombre_receptor = $data['nombre_receptor'];
            $paquete->telefono_receptor = $data['telefono_receptor'];
            $paquete->direccion = $data['direccion'];
            $paquete->direccionD = $data['direccionD'];

            $paquete->descripcion_paquete = $data['descripcion_paquete'];
            if($paquete->save() == true){
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
            $conductor = Paquete::find($id)->conductor;
            $paquete = Paquete::find($id);

            if (is_null ($paquete))
            {
                \App::abort(404);
            }else{
                $paquete->delete();
                $mensaje = 'Se retiro un paquete que se te habia sido asignado';
                $this->enviarNotificacion('', $mensaje, $conductor->id);
                return JsonResponse::create(array('message' => "Paquete eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el paquete", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

}
