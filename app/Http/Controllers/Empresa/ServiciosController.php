<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Cliente;
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
        $pasajero->direccionO = $data["direccionO"];
        $pasajero->destino = $data["destino"];

        $pasajero->direccionD = $data["direccionD"];
        $pasajero->vehiculo = $data["vehiculo"];
        if ($pasajero->save() == true) {
            return JsonResponse::create(array('message' => "Guardado Correctamente", "identificacion" => $pasajero->identificacion), 200);
        }else{
            return JsonResponse::create(array('message' => "El Pasajero ya esta registrado", "identificacion" => $pasajero->identificacion), 200);
        }
    }

    public function putPasajero(Request $request, $id){
        try{
            $data = $request->all();
            $pasajero = Pasajero::select("*")
                ->where("identificacion", $id)
                ->first();
            $pasajero->identificacion = $data["identificacion"];
            $pasajero->nombres = $data["nombres"];
            $pasajero->apellidos = $data["apellidos"];
            $pasajero->telefono = $data["telefono"];

            $pasajero->origen = $data["origen"];
            $pasajero->direccionO = $data["direccionO"];
            $pasajero->destino = $data["destino"];

            $pasajero->direccionD = $data["direccionD"];
            $pasajero->vehiculo = $data["vehiculo"];
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
                $pasajero->delete();
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

    public function postGiro(Request $request){
        $data = $request->all();
        $giro = new Giro();

        $giro->ide_remitente = $data['ide_remitente'];
        $giro->nombres_remitente = $data['nombres_remitente'];
        $giro->tel_remitente = $data['tel_remitente'];
        $giro->ide_receptor = $data['ide_receptor'];
        $giro->nombres_receptor = $data['nombres_receptor'];
        $giro->tel_receptor = $data['tel_receptor'];
        $giro->origen = $data['origen'];
        $giro->direccionO = $data['direccionO'];
        $giro->destino = $data['destino'];
        $giro->direccionD = $data['direccionD'];
        $giro->vehiculo = $data['vehiculo'];
        $giro->cantidad = $data['cantidad'];

        if ($giro->save() == true) {
            return JsonResponse::create(array('message' => "Guardado Correctamente"), 200);
        }else{
            return JsonResponse::create(array('message' => "El Pasajero ya esta registrado"), 200);
        }


    }

    public function putGiro(Request $request, $id){
        try{
            $data = $request->all();
            $giro = Giro::select("*")
                ->where("id", $id)
                ->first();
            $giro->ide_remitente = $data['ide_remitente'];
            $giro->nombres_remitente = $data['nombres_remitente'];
            $giro->tel_remitente = $data['tel_remitente'];
            $giro->ide_receptor = $data['ide_receptor'];
            $giro->nombres_receptor = $data['nombres_receptor'];
            $giro->tel_receptor = $data['tel_receptor'];
            $giro->origen = $data['origen'];
            $giro->direccionO = $data['direccionO'];
            $giro->destino = $data['destino'];
            $giro->direccionD = $data['direccionD'];
            $giro->vehiculo = $data['vehiculo'];
            $giro->cantidad = $data['cantidad'];
            if($giro->save() == true){
                return JsonResponse::create(array('message' => "Actualizado Correctamente"), 200);
            }else {
                return JsonResponse::create(array('message' => "No se pudo actualizar el registro"), 200);
            }
        }catch(Exception $e){
            return JsonResponse::create(array('message' => "No se pudo guardar el registro", "exception"=>$e->getMessage()), 401);
        }
    }

    public function deleteGiro($id){
        try{
            $giro = Giro::select("*")
                ->where("id", $id)
                ->first();
            if (is_null ($giro))
            {
                App::abort(404);
            }else{
                $giro->delete();
                return JsonResponse::create(array('message' => "Giro eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Giro", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

    public function getPaquetes(){
        $paquetes = Paquete::all();
        return $paquetes;
    }

    public function postPaquete(Request $request){
        $data = $request->all();
        $paquete = new Paquete();

        $paquete->ide_remitente = $data['ide_remitente'];
        $paquete->nombres_remitente = $data['nombres_remitente'];
        $paquete->tel_remitente = $data['tel_remitente'];
        $paquete->ide_receptor = $data['ide_receptor'];
        $paquete->nombres_receptor = $data['nombres_receptor'];
        $paquete->tel_receptor = $data['tel_receptor'];
        $paquete->origen = $data['origen'];
        $paquete->direccionO = $data['direccionO'];
        $paquete->destino = $data['destino'];
        $paquete->direccionD = $data['direccionD'];
        $paquete->vehiculo = $data['vehiculo'];
        $paquete->descripcion_paquete = $data['descripcion_paquete'];

        if ($paquete->save() == true) {
            return JsonResponse::create(array('message' => "Guardado Correctamente"), 200);
        }else{
            return JsonResponse::create(array('message' => "El Pasajero ya esta registrado"), 200);
        }
    }

    public function putPaquete(Request $request, $id){
        try{
            $data = $request->all();
            $paquete = Paquete::select("*")
                ->where("id", $id)
                ->first();
            $paquete->ide_remitente = $data['ide_remitente'];
            $paquete->nombres_remitente = $data['nombres_remitente'];
            $paquete->tel_remitente = $data['tel_remitente'];
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

    public function deletePaquete($id){
        try{
            $paquete = Paquete::select("*")
                ->where("id", $id)
                ->first();
            if (is_null ($paquete))
            {
                App::abort(404);
            }else{
                $paquete->delete();
                return JsonResponse::create(array('message' => "Paquete eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el paquete", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }

    public function getCliente($id){
        $cliente = Cliente::select("*")->where("identificacion", $id)->first();
        return $cliente;
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
