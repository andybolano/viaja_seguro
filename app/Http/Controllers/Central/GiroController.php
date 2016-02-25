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
                            'subtitle' => 'Giros'
                        ),
                    ),
                    'android'=> array(
                        'collapseKey'=>'foo',
                        'delayWhileIdle'=> true,
                        'timeToLive'=> 300,
                        'payload'=> array(
                            'message' => $mensaje,
                            'title' => 'Viaja Seguro',
                            'subtitle' => 'Giros',
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
            $result = curl_exec($ch);
            var_dump($result);
            curl_close($ch);
            return JsonResponse::create(array('result' => $result));
        } else {
            return JsonResponse::create(array('result' => 'No existe el usuario'));
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
