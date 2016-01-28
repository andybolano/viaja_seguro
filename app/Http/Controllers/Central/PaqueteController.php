<?php

namespace App\Http\Controllers\Central;

use App\Model\Paquete;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Model\Central;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PaqueteController extends Controller
{
    public function index($central_id){
        try{
            $paquetes = Central::find($central_id)->paquetes;
            $paquetes->load('central');
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
            $paquete = new Paquete();
            $paquete->ide_remitente = $data['ide_remitente'];
            $paquete->ide_receptor = $data['ide_receptor'];
            $paquete->nombres_receptor = $data['nombres_receptor'];
            $paquete->tel_receptor = $data['tel_receptor'];
            $paquete->origen = $data['origen'];
            $paquete->direccionO = $data['direccionO'];
            $paquete->destino = $data['destino'];
            $paquete->direccionD = $data['direccionD'];
            $paquete->vehiculo = $data['vehiculo'];
            $paquete->descripcion_paquete = $data['descripcion_paquete'];

            if(!Central::find($central_id)->paquetes()->save($paquete)){
                return response()->json(['mensajeError' => 'No se ha posido registrar al paquete'], 400);
            }
            return response()->json($paquete, 201);
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
            $paquete = Paquete::find($id);
            $paquete->ide_remitente = $data['ide_remitente'];
            $paquete->ide_receptor = $data['ide_receptor'];
            $paquete->nombres_receptor = $data['nombres_receptor'];
            $paquete->tel_receptor = $data['tel_receptor'];
            $paquete->origen = $data['origen'];
            $paquete->direccionO = $data['direccionO'];
            $paquete->destino = $data['destino'];
            $paquete->direccionD = $data['direccionD'];
            $paquete->vehiculo = $data['vehiculo'];
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
            $paquete = Paquete::find($id);
            if (is_null ($paquete))
            {
                \App::abort(404);
            }else{
                $paquete->delete();
                return JsonResponse::create(array('message' => "Paquete eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el paquete", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

}
