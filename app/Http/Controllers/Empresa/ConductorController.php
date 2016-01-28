<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Empresa;
use App\Model\Conductor;
use App\Model\Usuario;
use App\Model\Rol;
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

    public function getRol()
    {
        return Rol::where('nombre', 'CONDUCTOR')->first();
    }

    public function store(Request $request, $empresa_id)
    {
        try{
            $data = $request->json()->all();
            //USUARIO
            $usuario = Usuario::nuevo($data['identificacion'], $data['identificacion'], $this->getRol()->id);
            $data['usuario_id'] = $usuario->id;

            $conductor = new Conductor($data);
            if(!Empresa::find($empresa_id)->conductores()->save($conductor)){
                $usuario->delete();
                return response()->json(['mensajeError' => 'no se ha podido almacenar el usuario'], 400);
            }
            return response()->json($conductor, 201);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
    }

    public function guardaImagen(Request $request, $id)
    {
        try{
            $conductor = Conductor::select('*')
            ->where('identificacion', $id)->first();
            if(!$conductor){
                return response()->json(array("message"=> 'No se encontro el conductor'), 400);
            }

            if ($request->hasFile('imagen')) {
                $request->file('imagen')->move('images/conductores/', "conductor$id.png");
                $nombrefile = $_SERVER['PHP_SELF'].'/../images/conductores/'."conductor$id.png";
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
            $conductor = Conductor::find($id);
            if($conductor){
                $conductor->delete();
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
        $vehiculo = new Vehiculo();

        $conductor = Conductor::select('*')->where('identificacion', $conductor_id)->first();

        $vehiculo->placa = $data["placa"];
        $vehiculo->modelo = $data["modelo"];
        $vehiculo->color = $data["color"];
        $vehiculo->codigo_vial = $data["codigo_vial"];
        $vehiculo->cupos = $data["cupos"];
        $vehiculo->identificacion_propietario = $data["ide_propietario"];
        $vehiculo->nombre_propietario = $data["nombre_propietario"];
        $vehiculo->tel_propietario = $data["tel_propietario"];

        $busqueda = Vehiculo::select("placa")
            ->where("placa",$data["placa"])
            ->first();
        if ($busqueda == null) {
            if(!$conductor->vehiculo()->save($vehiculo)){
                return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
            }
            return JsonResponse::create(array('message' => "Se asigno el vehiculo correctametne."), 200);
        }else{
            return JsonResponse::create(array('message' => "La placa del vehiculo ya se encuentra registrada."), 200);
        }
    }
}
