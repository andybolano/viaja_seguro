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

            if(!Central::find($central_id)->paquetes()->save($paquete)){
                return response()->json(['mensajeError' => 'No se ha posido registrar al paquete'], 400);
            }
            return JsonResponse::create(array('message' => "Paquete asignado correctamente", 'result' => $this->enviarNotificacion($mensaje, $data['conductor_id'])), 200);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
    }

    function enviarNotificacion($mensaje, $conductor_id)
    {
        //llamar al usuario
        $data = Conductor::find($conductor_id)->usuario;

        if($data != false){

            $device_token=$data->reg_id;
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
                            'subtitle' => 'Paquetes'
                        ),
                    ),
                    'android'=> array(
                        'collapseKey'=>'foo',
                        'delayWhileIdle'=> true,
                        'timeToLive'=> 300,
                        'payload'=> array(
                            'message' => $mensaje,
                            'title' => 'Viaja Seguro',
                            'subtitle' => 'Paquetes',
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
            var_dump($result);
            curl_close($ch);
            return JsonResponse::create(array('result' => $result));
        } else {
            return JsonResponse::create(array('result' => 'No existe el usuario'));
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
                return response()->json(['message' => "Paquete eliminado correctamente", 'result'=> $this->enviarNotificacion($mensaje, $conductor->id)], 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el paquete", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

}
