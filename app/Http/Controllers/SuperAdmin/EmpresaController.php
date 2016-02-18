<?php namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Model\Conductor;
use App\Model\Empresa;
use App\Model\Rol;
use App\Model\Ruta;
use App\Model\Turno;
use App\Model\Usuario;
use App\Model\Vehiculo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\DateTime;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $empresas = Empresa::with('servicios')->get();
        return $empresas;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $empresa = Empresa::find($id);
        $empresa->load('servicios');
        return $empresa;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
//        try{
            $data = $request->json()->all();
            $empresa_servicios = $data['servicios'];
            unset($data['servicios']);
            $data_usuario = $data['usuario'];
            unset($data['usuario']);
            $usuario = Usuario::nuevo($data_usuario['nombre'], $data_usuario['contrasena'], $this->getRol('EMPRESA')->id);
            $data['usuario_id'] = $usuario->id;
            $empresa = new Empresa($data);
            if($empresa->save()) {
                foreach ($empresa_servicios as $servicio) {
                    $empresa->servicios()->attach($servicio['id']);
                }
                return response()->json($empresa, 201);
            }else{
                return response()->json(['mensajeError' => 'no se ha podido almacenar el usuario'], 400);
                $usuario->delete();
            }
//        } catch (\Exception $exc) {
//            return response()->json(array("exception"=>$exc->getMessage()), 400);
//        }
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return mixed
     */
    public function saveLogo(Request $request, $id)
    {
        try{
            if ($request->hasFile('logo')) {
                $request->file('logo')->move('images/empresas/', "empresa$id.png");
                $nombrefile = $_SERVER['SERVER_NAME'].'/public/images/empresas/'."empresa$id.png";
                $empresa = $this->show($id);
                $empresa->logo = $nombrefile;
                $empresa->save();
                return response()->json(['nombrefile'=>$nombrefile], 201);
            }else {
                return response()->json([], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
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
            $data = $request->json()->all();
            $empresa_servicios = isset($data['servicios']) ? $data['servicios'] : false;
            unset($data['servicios']);
            $empresa = $this->show($id);
            if($empresa){
                //actualizo los compos de la empresa
                foreach($data as $campo=>$valor){
                    $empresa->$campo = $valor;
                }
                $empresa->save();
                if($empresa_servicios){
                    $servicios = [];
                    foreach($empresa_servicios as $servicio){
                        $servicios[] = $servicio['id'];
                    }
                    $empresa->servicios()->sync($servicios);
                }
                return response()->json(['mensaje' => 'registro actualizado'], 201);
            }else{
                return response()->json(['mensaje' => 'la empresa no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage(), ''=>$exc->getLine()), 400);
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
        $empresa = $this->show($id);
        if($empresa){
            $empresa->servicios()->detach();
            $usuario = $empresa->usuario;
            $empresa->delete();
            $usuario->delete();
            return response()->json(['mensaje' => 'registro eliminado'], 201);
        }else{
            return response()->json(['mensaje' => 'la empresa no existe'], 400);
        }
    }

    public function storeConductor(Request $request, $empresa_id)
    {
        $data = $request->json()->all();
        $usuario = Usuario::nuevo($data['identificacion'], $data['identificacion'], $this->getRol('CONDUCTOR')->id, '');
        $data['usuario_id'] = $usuario->id;
        $vehiculo_conductor = $data['vehiculo'];
        unset($data['vehiculo']);

        $conductor = new Conductor($data);
        echo print_r($conductor);
        $conductor->activo = true;
        $empresa = Empresa::find($empresa_id);
        if(!$empresa->conductores()->save($conductor)){
            $usuario->delete();
            return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
        }
        $this->storeVehiculoconductor($conductor, $vehiculo_conductor);
    }

    private function storeVehiculoconductor(&$conductor, $data){
        $busqueda = Vehiculo::select("placa")
            ->where("placa",$data["placa"])
            ->first();
        if ($busqueda == null) {
            if(!$conductor->vehiculo()->save(new Vehiculo($data))){
                $usuario = $conductor->usuario;
                $conductor->delete();
                $usuario->delete();
                return response()->json(['mensajeError' => 'no se ha podido almacenar el vehiculo dle conductor'], 400);
            }
            return response()->json($conductor, 200);
        }else{
            return response()->json(array('message' => "La placa del vehiculo ya se encuentra registrada."), 200);
        }
    }

    public function getConductores($id)
    {
        $conductores = [];
        foreach (Empresa::find($id)->conductores as &$conductor) {
            if($conductor->activo) {
                if ($conductor->central) {
                    $conductor->central->load('ciudad');
                }
                $conductores[] = $conductor;
            }
        }
        return $conductores;
    }

    public function getAllConductores($id)
    {
        $conductores = Empresa::find($id)->conductores;
        foreach ($conductores as &$conductor) {
            if($conductor->central) {
                $conductor->central->load('ciudad');
            }
        }
        return $conductores;
    }

    public function getVehiculos($id)
    {
        $vehiculos = Empresa::find($id)->vehiculos;
        $vehiculos->load('conductor');
        $arr = [];
        foreach ($vehiculos as &$vehiculo) {
            if($vehiculo->conductor->activo) {
                $arr[] = $vehiculo;
            }
        }
        return $arr;
    }

    public function getRutas($id)
    {
        $centrales = Empresa::find($id)->centrales;
        $rutas = [];
        foreach ($centrales as $central) {
            foreach ($central->rutas as $ruta) {
                $rutas[] = [
                    'id' => $ruta->id,
                    'origen' => $central->load('ciudad'),
                    'destino' => $ruta->destino->load('ciudad')
                ];
            }
        }
        return $rutas;
    }

    public function getConductoresEnRuta($ruta_id)
    {
        $con = \DB::table('conductores')
            ->whereNotExists(function($query){
                $query->select(\DB::raw(1))
                    ->from('turnos')
                    ->whereRaw('turnos.conductor_id = conductores.id');
            })->get();
        return JsonResponse::create($con);
    }

    private function getRol($nombre)
    {
        return Rol::where('nombre', $nombre)->first();
    }
}