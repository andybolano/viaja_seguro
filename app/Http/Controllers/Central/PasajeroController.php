<?php

namespace App\Http\Controllers\Central;

use App\Model\Central;
use App\Model\Cliente;
use App\Model\Conductor;
use App\Model\Pasajero;
use App\Model\Usuario;
use App\Model\Rol;
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
    public function index($conductor_id)
    {
        try{
            $pasajeros = Conductor::find($conductor_id)->pasajeros;
            return $pasajeros;
        }catch(\Exception $e){
            return response()->json(array('message' => 'Error'), 400);
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $central_id)
    {
        $data = $request->json()->all();

        $pasajero = new Pasajero($data);
        $conductor = Conductor::find($data['conductor_id']);
        $conductor->pasajeros()->save($pasajero);
        $central = Central::find($central_id);
        if(!$central->pasajeros()->save($pasajero)){
            return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Pasajero::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $data = $request->all();
            $pasajero = Pasajero::find($id);
            $pasajero->identificacion = $data["identificacion"];
            $pasajero->nombres = $data["nombres"];
            $pasajero->telefono = $data["telefono"];
            $pasajero->direccion = $data["direccion"];
            $pasajero->direccionD = $data["direccionD"];

            if($pasajero->save() == true){
                return JsonResponse::create(array('message' => "Actualizado Correctamente"), 200);
            }else {
                return JsonResponse::create(array('message' => "No se pudo actualizar el registro"), 200);
            }
        }catch(Exception $e){
            return JsonResponse::create(array('message' => "No se pudo guardar el registro", "exception"=>$e->getMessage()), 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $pasajero = Pasajero::find($id);
            if (is_null ($pasajero))
            {
                \App::abort(404);
            }else{
                $pasajero->delete();
                return JsonResponse::create(array('message' => "Cleinte eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Pasajero", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

    private function getRol($nombre)
    {
        return Rol::where('nombre', $nombre)->first();
    }
}
