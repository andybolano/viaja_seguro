<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Pasajero;
use App\Model\Giro;
use App\Model\Paquete;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ServiciosController extends Controller
{
    public function getPasajeros(){
        $pasajeros = Pasajero::all();
        return $pasajeros;
    }

    public function postPasajero(Request $request){
        $data = $request->all();
        $pasajero = new Pasajero();
        $pasajero->identificacion = $data["identificacion"];
        $pasajero->nombres = $data["nombres"];
        $pasajero->apellidos = $data["apellidos"];
        $pasajero->telefono = $data["telefono"];
        $pasajero->origen = $data["origen"];
        $pasajero->destino = $data["destino"];
        $pasajero->vehiculo = $data["vehiculo"];
        if ($pasajero->save() == true) {
            return JsonResponse::create(array('message' => "Guardado Correctamente", "identificacion" => $pasajero->identificacion), 200);
        }else{
            return JsonResponse::create(array('message' => "El Pasajero ya esta registrado", "identificacion" => $pasajero->identificacion), 200);
        }
    }

    public function putPasajero(Request $request, $id){
        try{
//            $data = $request->all();
            $pasajero = Pasajero::select("*")
                ->where("identificacion", $id)
                ->first();
            $pasajero->identificacion = $request->identificacion;
            $pasajero->nombres = $request->nombres;
            $pasajero->apellidos = $request->apellidos;
            $pasajero->direccion = $request->direccion;
            $pasajero->telefono = $request->telefono;
            if($pasajero->save() == true){
                return JsonResponse::create(array('message' => "Actualizado Correctamente"), 200);
            }else {
                return JsonResponse::create(array('message' => "No se pudo actualizar el registro"), 200);
            }
        }catch(Exception $e){
            return JsonResponse::create(array('message' => "No se pudo guardar el registro", "exception"=>$e->getMessage()), 401);
        }
    }

    public function deletePasajero($id){
        try{
            $pasajero = Pasajero::select("*")
                ->where("identificacion", $id)
                ->first();
            if (is_null ($pasajero))
            {
                App::abort(404);
            }else{
                $Pasajero->delete();
                return JsonResponse::create(array('message' => "Cleinte eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Pasajero", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }



    public function getGiros(){
        $giros = Giro::all();
        return $giros;
    }

    public function postGiro(){

    }

    public function putGiro(){

    }

    public function deleteGiro(){

    }

    public function getPaquetes(){
        $paquetes = Paquete::all();
        return $paquetes;
    }

    public function postPaquete(){

    }

    public function putPaquete(){

    }

    public function deletePaquete(){

    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
