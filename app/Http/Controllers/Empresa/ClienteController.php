<?php

namespace App\Http\Controllers\Empresa;

use App\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use PhpParser\Node\Expr\Clone_;

class ClienteController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $clientes = Cliente::all();
        return $clientes;
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
        $cliente = new Cliente();
        $cliente->identificacion = $data["identificacion"];
        $cliente->nombres = $data["nombres"];
        $cliente->apellidos = $data["apellidos"];
        $cliente->direccion = $data["direccion"];
        $cliente->telefono = $data["telefono"];
        $cliente->fechaNac = $request->fechaNac;
        $busqueda = Cliente::select("identificacion")
            ->where("identificacion",$data["identificacion"])
            ->first();
        if ($busqueda == null) {
            $cliente->save();
            return JsonResponse::create(array('message' => "Guardado Correctamente", "identificacion" => $cliente->identificacion), 200);
        }else{
            return JsonResponse::create(array('message' => "El cliente ya esta registrado", "identificacion" => $cliente->identificacion), 200);
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
            $cliente = Cliente::select("*")
                ->where("identificacion", $id)
                ->first();

            $cliente->identificacion = $request->identificacion;
            $cliente->nombres = $request->nombres;
            $cliente->apellidos = $request->apellidos;
            $cliente->direccion = $request->direccion;
            $cliente->telefono = $request->telefono;
            $cliente->fechaNac = $request->fechaNac;
            if($cliente->save() == true){
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
            $cliente = Cliente::select("*")
                ->where("identificacion", $id)
                ->first();
            if (is_null ($cliente))
            {
                App::abort(404);
            }else{
                $cliente->delete();
                return JsonResponse::create(array('message' => "Cleinte eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el cliente", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }
}
