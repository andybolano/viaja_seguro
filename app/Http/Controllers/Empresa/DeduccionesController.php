<?php

namespace App\Http\Controllers\Empresa;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\Deduccion;
use App\Model\Empresa;

class DeduccionesController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($empresa_id)
    {
        try{
            $deducciones = Empresa::find($empresa_id)->deducciones;
            return $deducciones;
        }catch(\Exception $e){
            return response()->json(array("exception"=>$e->getMessage()), 400);
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
    public function store(Request $request, $empresa_id)
    {
//        try{
            $data = $request->json()->all();

            $deduccion = new Deduccion($data);

            if(!Empresa::find($empresa_id)->deducciones()->save($deduccion)){
                return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
            }
            return response()->json($deduccion, 201);
//        } catch (\Exception $exc) {
//            return response()->json(array("exception"=>$exc->getMessage()), 400);
//        }
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
        try {
            $deduccion = Deduccion::find($id);

            $deduccion->nombre = $request->nombre;
            $deduccion->descripcion = $request->descripcion;
            $deduccion->valor = $request->valor;
            $deduccion->estado = $request->estado;

            $deduccion->save();
            return JsonResponse::create(array('message' => "Registro actualizado correctamente"), 200);

        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "Error al actualizar los datos", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }

    public function updateEstado($id,$estado){
        try {
            $deduccion = Deduccion::find($id);
            $deduccion->estado = $estado;
            $deduccion->save();

            if($estado == 'true'){
                $mensaje = 'Activado';
            }else{
                $mensaje = 'Desactivado';
            }

            return JsonResponse::create(array('message' => "$deduccion->nombre $mensaje correctamente",200));

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
        try{
            $deduccion = Deduccion::find($id);
            if (is_null ($deduccion))
            {
                \App::abort(404);
            }else{
                $deduccion->delete();
                return JsonResponse::create(array('message' => "Deduccion eliminada correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar la deduccion", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }

    }
}
