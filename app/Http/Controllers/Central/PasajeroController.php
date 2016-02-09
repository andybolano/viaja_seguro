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
            if(!$pasajeros){
                return response()->json(array('message' => 'El conductor no tiene pasajeros asignados'), 400);
            }else{
                return $pasajeros;
            }

        }catch(\Exception $e){
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
        $mensaje = 'Se te asigno un nuevo pasajero';
        $this->enviarNotificacion('', $mensaje, $data['conductor_id']);
        $central = Central::find($central_id);
        if(!$central->pasajeros()->save($pasajero)){
            return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
        }
    }

    function enviarNotificacion($collapseKey, $mensaje, $conductor_id)
    {
        //llamar al usuario
        $data = Conductor::find($conductor_id)->usuario;

        if($data != false){

            $apiKey = 'AIzaSyAZB5qS20uH0-W_btPvbLRx_D2qFHnNCt8';

            $userIdentificador = $data["reg_id"];

            $headers = array('Authorization:key=' . $apiKey);
            $data = array(
                'registration_ids' => $userIdentificador,
                'collapse_key' => $collapseKey,
                'data.message' => $mensaje,
                'data.fecha' => date('Y-m-d'));

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send");
            if ($headers)
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if (curl_errno($ch)) {
                return 'fail';
            }
            if ($httpCode != 200) {
                return 'status code 200';
            }
            curl_close($ch);
            return $response;
        } else {
            return 'No existe el usuario';
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
            $conductor = Pasajero::find($id)->conductor;
            $pasajero = Pasajero::find($id);
            if (is_null ($pasajero))
            {
                \App::abort(404);
            }else{
                $pasajero->delete();
                $mensaje = 'Se retiro un pasajero que se te habia sido asignado';
                $this->enviarNotificacion('', $mensaje, $conductor->id);
                return JsonResponse::create(array('message' => "Pasajero eliminado correctamente", "request" =>json_encode($id)), 200);
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
