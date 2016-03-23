<?php

namespace App\Http\Controllers\Central;

use App\Model\Conductor;
use App\Model\Paquete;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Model\Central;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Http\Controllers\NotificacionController;

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
        $noty = new NotificacionController();
        try{
            $data = $request->json()->all();
            $paquete = new Paquete($data);

            Conductor::find($data['conductor_id'])->paquetes()->save($paquete);

            $mensaje = 'Se te asigno un nuevo paquete';

            if(!Central::find($central_id)->paquetes()->save($paquete)){
                return response()->json(['mensajeError' => 'No se ha posido registrar al paquete'], 400);
            }
            return JsonResponse::create(array('message' => "Paquete asignado correctamente", json_decode($noty->enviarNotificacionConductores($mensaje, $data['conductor_id'], 'Paquetes'))), 200);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
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
            $paquete = $this->show($id);
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
        $noty = new NotificacionController();
        try{
            $conductor = Paquete::find($id)->conductor;
            $paquete = $this->show($id);

            if (is_null ($paquete))
            {
                \App::abort(404);
            }else{
                $paquete->delete();
                $mensaje = 'Se retiro un paquete que se te habia sido asignado';
                return response()->json(['message' => "Paquete eliminado correctamente", json_decode($noty->enviarNotificacionConductores($mensaje, $conductor->id, 'Paquetes'))], 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el paquete", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

    public function moverPaquete(Request $request, $paquete_id){
        $noty = new NotificacionController();
        $paquete = $this->show($paquete_id);
        $paquete->conductor_id = $request->conductor_id;
        if($paquete->save()){
            return JsonResponse::create(array('message' => 'Se movio el paquete conrrectamente de conductor.', json_decode($noty->enviarNotificacionConductores('Se te asigno un nuevo paquete', $request->conductor_id, 'Paquete' ))));
        }
    }
}
