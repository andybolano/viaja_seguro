<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Cliente;
use App\Model\Conductor;
use App\Model\Documentacion;
use App\Model\Vehiculo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Mockery\CountValidator\Exception;

class VehiculoController extends Controller
{
    private $vehiculoEnTurno = 'UJSK-345';
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $vehiculos = Vehiculo::all();
            return $vehiculos;
        }catch(Exception $e){
            return JsonResponse::create(array('message' => "Error al cargar los vehiculos", "exception"=>$e->getMessage()), 401);
        }
    }

    public function getVehiculoEnTurno(){
        return $this->vehiculoEnTurno;
    }

    public function getDocumentacion(){
        $documentacion = Documentacion::all();
        return $documentacion;
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
        $vehiculo = new Vehiculo();

        $conductor = Conductor::select("*")
            ->where("identificacion", $data["ide_conductor"])
            ->first();
        $conductor->vehiculo_id = $data["placa"];

        $vehiculo->conductor_id = $data["ide_conductor"];
        $vehiculo->placa = $data["placa"];
        $vehiculo->modelo = $data["modelo"];
        $vehiculo->color = $data["color"];
        $vehiculo->codigo_vial = $data["codigo_vial"];
        $vehiculo->cupos = $data["cupos"];
        $vehiculo->ide_propietario = $data["ide_propietario"];
        $vehiculo->nombre_propietario = $data["nombre_propietario"];
        $vehiculo->tel_propietario = $data["tel_propietario"];


        $busqueda = Vehiculo::select("placa")
            ->where("placa",$data["placa"])
            ->first();
        if ($busqueda == null) {
            $conductor->save();
            $vehiculo->save();
            return JsonResponse::create(array('message' => "Se asigno el vehiculo correctametne."), 200);
        }else{
            return JsonResponse::create(array('message' => "La placa del vehiculo ya se encuentra registrada."), 200);
        }
    }

    public function guardaImagen(Request $request, $id)
    {
        try{
            $vehiculo = Vehiculo::select('*')
                ->where('placa', $id)->first();

            if ($request->hasFile('imagenv')) {
                $request->file('imagenv')->move('images/vehiculos/', "vehiculo$id.png");
                $nombrefile = $_SERVER['PHP_SELF'].'/../images/vehiculos/'."vehiculo$id.png";
                $vehiculo->imagen = $nombrefile;
                $vehiculo->save();
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
        $data = $request->all();
        $vehiculo = Vehiculo::select("*")
            ->where("placa", $data["placa"])
            ->first();

        $conductor = Conductor::select("*")
            ->where("identificacion", $data["ide_conductor"])
            ->first();
        $conductor->vehiculo_id = $data["placa"];

        $vehiculo->ide_conductor = $data["ide_conductor"];
        $vehiculo->placa = $data["placa"];
        $vehiculo->modelo = $data["modelo"];
        $vehiculo->color = $data["color"];
        $vehiculo->codigo_vial = $data["codigo_vial"];
        $vehiculo->cupos = $data["cupos"];
        $vehiculo->ide_propietario = $data["ide_propietario"];
        $vehiculo->nombre_propietario = $data["nombre_propietario"];
        $vehiculo->tel_propietario = $data["tel_propietario"];

//
//        $busqueda = Vehiculo::select("placa")
//            ->where("placa",$data["placa"])
//            ->first();
        $conductor->save();
        $vehiculo->save();
        return JsonResponse::create(array('message' => "Vehiculo actualizado correctametne."), 200);
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
            $vehiculo = Vehiculo::select("*")
                ->where("placa", $id)
                ->first();
            if (is_null ($vehiculo))
            {
                App::abort(404);
            }else{
                $vehiculo->delete();
                return JsonResponse::create(array('message' => "Vehiculo eliminado correctamente", "request" =>json_encode($id)), 200);
            }
        }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el vehiculo", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }
}
