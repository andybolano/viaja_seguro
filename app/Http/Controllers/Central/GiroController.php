<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\NotificacionController;
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
        $noty = new NotificacionController();
        try{
            $data = $request->json()->all();
            $giro = new Giro($data);
            Conductor::find($data['conductor_id'])->giros()->save($giro);

            $mensaje = 'Se te asigno un nuevo giro';

            if(!Central::find($central_id)->giros()->save($giro)){
                $giro->delete();
                return response()->json(['mensajeError' => 'No se ha posido registrar al giro'], 400);
            }
            return JsonResponse::create(array('message' => "Se asigno el giro correctamente", json_decode($noty->enviarNotificacionConductores($mensaje, $data['conductor_id'], 'Giros'))), 200);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
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
        $noty = new NotificacionController();
        try{
            $conductor = Giro::find($id)->conductor;
            $giro = Giro::find($id);
            if (is_null ($giro))
            {
                \App::abort(404);
            }else{
                $giro->delete();
                $mensaje = 'Se retiro un giro que se te habia sido asignado';
                return JsonResponse::create(array('message' => "Giro eliminado correctamente", json_decode($noty->enviarNotificacionConductores($mensaje, $conductor->id,'Giros'))), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo eliminar el Giro", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

    public function moverGiro(Request $request, $giro_id){
        $noty = new NotificacionController();
        $giro = $this->show($giro_id);
        $giro->conductor_id = $request->conductor_id;
        if($giro->save()){

            return JsonResponse::create(array('message' => 'Se movio el giro conrrectamente de conductor.', json_decode($noty->enviarNotificacionConductores('Se te asigno un nuevo giro', $request->conductor_id, 'Giro' ))));
        }
    }

}
