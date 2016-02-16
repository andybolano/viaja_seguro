<?php

namespace App\Http\Controllers\Empresa;

use DB;
use App\Model\Ubicacion;
use App\Model\Conductor;
use App\Model\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Mockery\CountValidator\Exception;

class ConductorController extends Controller
{

    public function getVehiculo($id){
        $conductor = Conductor::find($id);
        if(!$conductor){
            return response()->json(array("message"=> 'No se encontro el conductor'), 400);
        }
        return $conductor->vehiculo;
    }

    public function guardaImagen(Request $request, $id)
    {
        try{
            $conductor = Conductor::find($id);
            if(!$conductor){
                return response()->json(array("message"=> 'No se encontro el conductor'), 400);
            }

            if ($request->hasFile('imagen')) {
                $request->file('imagen')->move('images/conductores/', "conductor$id.png");
                $nombrefile = $_SERVER['SERVER_NAME'].'/public/images/conductores/'."conductor$id.png";
                $conductor->imagen = $nombrefile;
                $conductor->save();
                return response()->json(['nombrefile'=>$nombrefile], 201);
            }else {
                return response()->json([], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
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
        $conductor = Conductor::find($id);

        if (!$conductor){
            $conductor = Conductor::where('identificacion', $id )->first();
            if(!$conductor){
                return response()->json(array("message"=> 'No se encontro el conductor'), 400);
            }
        }
        return $conductor->load('empresa');
//        $empresa = Empresa::select('id', 'nombre')->where('id', $conductor->empresa_id)->first();
//        $conductor->empresa()->associate($empresa);
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
            $conductor = Conductor::find($id);

            $conductor->identificacion = $request->identificacion;
            $conductor->nombres = $request->nombres;
            $conductor->apellidos = $request->apellidos;
            $conductor->direccion = $request->direccion;
            $conductor->telefono = $request->telefono;
            $conductor->correo = $request->correo;
            $conductor->activo = $request->activo;
            $conductor->central_id = $request->central_id;
            if($conductor->save() == true){
                return JsonResponse::create(array('message' => "Actualizado Correctamente"), 200);
            }else {
                return JsonResponse::create(array('message' => "No se pudo actualizar el registro"), 400);
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
            $conductor = Conductor::find($id);
            if($conductor){
                $usuario = $conductor->usuario;
                $conductor->delete();
                $usuario->delete();
                return response()->json(['message' => 'Registro eliminado'], 201);
            }else{
                return response()->json(['message' => 'El conductor no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage(), ''=>$exc->getLine()), 400);
        }
    }

    public function postVehiculo(Request $request, $conductor_id){
        $data = $request->all();
        $busqueda = Vehiculo::select("placa")
            ->where("placa",$data["placa"])
            ->first();
        if ($busqueda == null) {
            $conductor = Conductor::find($conductor_id);
            if(!$conductor->vehiculo()->save(new Vehiculo($data))){
                return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
                $usuario->delete();
            }
            return JsonResponse::create(array('message' => "Se asigno el vehiculo correctametne."), 200);
        }else{
            return JsonResponse::create(array('message' => "La placa del vehiculo ya se encuentra registrada."), 200);
        }
    }

    public function postUbicacion(Request $request, $conductor_id){
        $data = $request->all();

        $busqueda = \DB::table('ubicacion_conductor')->select('conductor_id')->where('conductor_id', $conductor_id)->first();
        if($busqueda == null){
            \DB::table('ubicacion_conductor')->insert(
                array('conductor_id' => $conductor_id, 'latitud' => $data['latitud'], 'longitud' => $data['longitud'])
            );
        }else{
            DB::table('ubicacion_conductor')->where('conductor_id', $conductor_id)
                ->update(['latitud' => $data['latitud'], 'longitud' => $data['longitud']]);
        }
    }

    public function getUbicacion($ruta_id){
        $busqueda = Ubicacion::select('*')->where('ruta_id', $ruta_id)->get();
//        $busqueda = \DB::table('ubicacion_conductor')->select('*')->where('ruta_id', $ruta_id)->get();
        $busqueda->load('conductor', 'vehiculo_conductor');
        if(!$busqueda){
            return JsonResponse::create(array('message' => 'No se encontraron ubicaciones'));
        }else{
            return $busqueda;
        }
    }
}
