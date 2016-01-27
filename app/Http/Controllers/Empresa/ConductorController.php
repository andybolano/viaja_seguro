<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Empresa;
use App\Model\Conductor;
use App\Model\Usuario;
use App\Model\Rol;
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
    public function index($empresa_id)
    {
        try{
            $conductores = Empresa::find($empresa_id)->conductores;
            return $conductores;
        }catch(\Exception $e){
            return response()->json(array("exception"=>$e->getMessage()), 400);
        }
    }

    public function getVehiculo($id){
        $vehiculo = Conductor::select('vehiculo_id')
            ->where('identificacion', $id)
            ->first();
        return $vehiculo;

    }

    public function guardaImagen(Request $request, $id)
    {
        try{
            $conductor = Conductor::select('*')
                ->where('identificacion', $id)->first();

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
        try{
            $data = $request->json()->all();

            $conductor = new Conductor($data);
            if(!Empresa::find($empresa_id)->conductores()->save($conductor)){
                return response()->json(['mensajeError' => 'no se ha podido almacenar el usuario'], 400);
            }
            return response()->json($conductor, 201);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }




        $data = $request->all();
        $conductor = new Conductor();

        //USUARIO
        $usuario = Usuario::nuevo($data['identificacion'], $data['identificacion'], $this->getRol()->id);
        $data['usuario_id'] = $usuario->id;

        $conductor->identificacion = $data["identificacion"];
        $conductor->nombres = $data["nombres"];
        $conductor->apellidos = $data["apellidos"];
        $conductor->direccion = $data["direccion"];
        $conductor->telefono = $data["telefono"];
        $conductor->correo = $data["correo"];
        $conductor->usuario_id = $data['usuario_id'];
        $busqueda = Conductor::select("identificacion")
            ->where("identificacion",$data["identificacion"])
            ->first();
        if ($busqueda == null) {
            $conductor->save();
            $usuario->save();
            return JsonResponse::create(array('message' => "Guardado Correctamente", "identificacion" => $conductor->identificacion), 200);
        }else{
            return JsonResponse::create(array('message' => "El conductor ya esta registrado", "identificacion" => $conductor->identificacion), 200);
        }
    }


    public function getRol()
    {
        return Rol::where('nombre', 'CONDUCTOR')->first();
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
                ->where("id", $id)
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
    public function destroy($empresa_id, $id)
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
}
