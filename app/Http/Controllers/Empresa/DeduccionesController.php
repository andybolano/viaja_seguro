<?php

namespace App\Http\Controllers\Empresa;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\Deduccion;

class DeduccionesController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $deducciones = Deduccion::all();

        return $deducciones;
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
        try {
            $deduccion = new Deduccion();
            $deduccion->nombre = $request->nombre;
            $deduccion->descripcion = $request->descripcion;
            $deduccion->valor = $request->valor;
            $deduccion->estado = $request->estado;
            $deduccion->save();
            return JsonResponse::create(array('message' => "Registro guardado correctamente"), 200);

        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo enviar el pedido", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
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
        //
    }

    public function updateEstado($id,$estado){
        try {
            $deduccion = Deduccion::find($id);
            $deduccion->estado = $estado;
            $deduccion->save();

            return JsonResponse::create(array('message' => "Estado de $deduccion->nombre actualizado correctamente",200));

        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo cambiar el estado de la deduccion", "exception"=>$exc->getMessage(), 401));
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
        //
    }
}
