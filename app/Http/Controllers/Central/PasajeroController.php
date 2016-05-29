<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\NotificacionController;
use App\Model\Central;
use App\Model\Cliente;
use App\Model\Conductor;
use App\Model\Pasajero;
use App\Model\Rol;
use App\Model\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PasajeroController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function obtenerPasajerosCentral($central_id)
    {
        $pasajeros = Central::find($central_id)->pasajeros;
        try {
            if (!$pasajeros) {
                return response()->json(array('message' => 'La central no tiene pasajeros en cola'), 400);
            } else {
                return $pasajeros;
            }
        } catch (\Exception $e) {
            return response()->json(array('message' => 'No se encontro ningun dato de consulta'), 400);
        }
    }

    public function index($conductor_id)
    {
        try {
            $pasajeros = Conductor::find($conductor_id)->pasajeros;
            if (!$pasajeros) {
                return response()->json(array('message' => 'El conductor no tiene pasajeros asignados'), 400);
            } else {
                return $pasajeros;
            }

        } catch (\Exception $e) {
            return response()->json(array('message' => 'No se encontro ningun dato de consulta'), 400);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    private function verificarCliente($identificacion)
    {
        return $cliente = Cliente::where('identificacion', $identificacion)->first();

    }

    private function crearUsuarioPasajero($identificacion){
        return Usuario::nuevo($identificacion, $identificacion, $this->getRol('CLIENTE')->id);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $central_id)
    {
        $data = $request->json()->all();

        $ecliente = $this->verificarCliente($data['identificacion']);
        if(!$ecliente){
            $usuario = $this->crearUsuarioPasajero($data['identificacion']);
            $cliente = new Cliente();
            $cliente->identificacion = $data['identificacion'];
            $cliente->nombres = $data['nombres'];
            $cliente->telefono = $data['telefono'];
            $cliente->direccion = $data['direccion'];
            $cliente->usuario_id = $usuario->id;

            if($cliente->save()){
                if($usuario){
                    $pasajero = new Pasajero($data);
                    $pasajero->identificacion = $data['identificacion'];
                    $pasajero->nombres = $data['nombres'];
                    $pasajero->telefono = $data['telefono'];
                    $pasajero->direccion = $data['direccion'];
                    $pasajero->central_id = $central_id;
                    if($pasajero->save()){
                        return JsonResponse::create(array('message' => "Se puso en espera al pasajero correctamente", 200));
                    }else{
                        return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
                    }
                }else{
                    $usuario->delete();
                    return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
                }
            }else{
                return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
            }
        }else{
            $pasajero = new Pasajero($data);
            $pasajero->identificacion = $data['identificacion'];
            $pasajero->nombres = $data['nombres'];
            $pasajero->telefono = $data['telefono'];
            $pasajero->direccion = $data['direccion'];
            $pasajero->central_id = $central_id;
            if($pasajero->save()){
                return JsonResponse::create(array('message' => "Se puso en espera al pasajero correctamente", 200));
            }else{
                return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
            }
        }


        $central = Central::find($central_id);
        if (!$central->pasajeros()->save($pasajero)) {
            $pasajero->delete();
            return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Pasajero::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            $pasajero = Pasajero::find($id);
            $pasajero->identificacion = $data["identificacion"];
            $pasajero->nombres = $data["nombres"];
            $pasajero->telefono = $data["telefono"];
            $pasajero->direccion = $data["direccion"];
//            $pasajero->direccionD = $data["direccionD"];

            if ($pasajero->save() == true) {
                return JsonResponse::create(array('message' => "Actualizado Correctamente"), 200);
            } else {
                return JsonResponse::create(array('message' => "No se pudo actualizar el registro"), 200);
            }
        } catch (Exception $e) {
            return JsonResponse::create(array('message' => "No se pudo guardar el registro", "exception" => $e->getMessage()), 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $pasajero = Pasajero::find($id);
            if (is_null($pasajero)) {
                \App::abort(404);
            } else {
                $pasajero->delete();
                return JsonResponse::create(array('message' => "Pasajero eliminado correctamente",  200));
            }
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Pasajero", "exception" => $ex->getMessage(), "request" => json_encode($id)), 401);
        }
    }

    public function moverPasajero(Request $request, $pasajero_id)
    {
        $noty = new NotificacionController();
        $pasajero = $this->show($pasajero_id);
        json_decode($noty->enviarNotificacionConductores('Se te fue retirado un pasajero que se te habia asignado', $pasajero->conductor_id, 'Pasajero'));
        $pasajero->conductor_id = $request->conductor_id;
        if ($pasajero->save()) {
            return JsonResponse::create(array('message' => 'Se movio el pasajero conrrectamente de conductor.', json_decode($noty->enviarNotificacionConductores('Se te asigno un nuevo pasajero', $request->conductor_id, 'Pasajero'))));
        }
    }

    private function getRol($rol){
        return Rol::where('nombre', $rol)->first();
    }

}
