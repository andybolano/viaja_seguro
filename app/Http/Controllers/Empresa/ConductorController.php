<?php

namespace App\Http\Controllers\Empresa;

use App\Conductor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Mockery\CountValidator\Exception;

class ConductorController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $conductores = Conductor::all();
        return $conductores;
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
    public function store(Request $request)
    {
        $data = $request->all();
        $conductor = new Conductor();
        $conductor->identificacion = $data["identificacion"];
        $conductor->nombres = $data["nombres"];
        $conductor->apellidos = $data["apellidos"];
        $conductor->direccion = $data["direccion"];
        $conductor->telefono = $data["telefono"];
        $conductor->correo = $data["correo"];
        $busqueda = Conductor::select("identificacion")
            ->where("identificacion",$data["identificacion"])
            ->first();
        if ($busqueda == null) {
            $conductor->save();
            return JsonResponse::create(array('message' => "Guardado Correctamente", "identificacion" => $conductor->identificacion), 200);
        }else{
            return JsonResponse::create(array('message' => "El conductor ya esta registrado", "identificacion" => $conductor->identificacion), 200);
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
        return Conductor::select('*')
            ->where("identificacion",$id)
            ->first();
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
//            $data = $request->all();
            $conductor = Conductor::select("*")
                ->where("identificacion", $id)
                ->first();

            $conductor->identificacion = $request->identificacion;
            $conductor->nombres = $request->nombres;
            $conductor->apellidos = $request->apellidos;
            $conductor->direccion = $request->direccion;
            $conductor->telefono = $request->telefono;
            $conductor->correo = $request->correo;
            if($conductor->save() == true){
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
            $conductor = Conductor::select("*")
                ->where("identificacion", $id)
                ->first();
            if (is_null ($conductor))
            {
                App::abort(404);
            }else{
                $conductor->delete();
                return JsonResponse::create(array('message' => "Conductor eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el conductor", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }

    }
}
