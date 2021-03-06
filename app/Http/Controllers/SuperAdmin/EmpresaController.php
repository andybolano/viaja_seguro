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
        $input = \Request::all();
        if(isset($input['include'])){
            $empresas = Empresa::with('servicios', $input['include'] . '.ciudad')->get();
            if (isset($input['ciudad'])) {
                $arr = [];
                foreach ($empresas as $empresa) {
                    foreach ($empresa->centrales as $central) {
                        if($central->ciudad->nombre == $input['ciudad']){
                            $arr[] = $empresa;
                            break;
                        }
                    }
                }
                $empresas = $arr;
            }
        }else {
            $empresas = Empresa::with('servicios')->get();
        }
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
                $nombrefile = $_SERVER['SERVER_NAME'].'/images/empresas/'."empresa$id.png";
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

    public function verificarConductor($identificacion){
        return Conductor::where('identificacion', $identificacion)->first();
    }

    function getUsuario($identificacion){
        return Usuario::where('email', $identificacion)->first();
    }

    public function storeConductor(Request $request, $empresa_id)
    {
        $data = $request->json()->all();
        if($this->verificarConductor($data['identificacion'])){
            return JsonResponse::create(array('mensajeError' => 'Ya existe un conductor con esta identificación'));
        }else{
            if($this->getUsuario($data['identificacion'])){
                return JsonResponse::create(array('mensajeError' => 'Ya se encuentra registrado un usuario para este conductor'));
            }else{

                $data = $request->json()->all();
                \DB::beginTransaction();
                try{
                    $usuario = Usuario::nuevo($data['identificacion'], $data['identificacion'], $this->getRol('CONDUCTOR')->id, '');
                    $data['usuario_id'] = $usuario->id;
                    $vehiculo_conductor = $data['vehiculo'];
                    unset($data['vehiculo']);

                    $conductor = new Conductor($data);
                    $conductor->activo = true;
                    $empresa = Empresa::find($empresa_id);
                    if(!$empresa->conductores()->save($conductor)){
                        \DB::rollBack();
                        return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
                    }
                    \DB::commit();
                    return $this->storeVehiculoconductor($conductor, $vehiculo_conductor);
                }catch (\Exception $e){
                    \DB::rollBack();
                }
            }
        }
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
            $conductor->load('vehiculo');
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
        $conductores = Empresa::with('conductores.central', 'conductores.central.ciudad', 'conductores.vehiculo')->find($id)->conductores;
//        foreach ($conductores as &$conductor) {
//            $con
//            if($conductor->central) {
//                $conductor->central->load('ciudad');
//            }
//        }
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
                $trayectoria = Ruta::find($ruta->id);
                $rutas[] = [
                    'id' => $ruta->id,
                    'origen' => $central->load('ciudad'),
                    'destino' => $ruta->destino->load('ciudad'),
                    'trayectoria' => $trayectoria->trayectoria
                ];
            }
        }
        return $rutas;
    }

    public function getConductoresDisponibles($empresa_id)
    {
        $con = \DB::table('conductores')
            ->join('vehiculos', 'conductores.id', '=', 'vehiculos.conductor_id')
            ->select('conductores.id', 'conductores.nombres', 'conductores.imagen', 'conductores.apellidos',
                'conductores.telefono', 'conductores.activo', 'conductores.central_id', 'conductores.identificacion',
                'conductores.estado')
            ->whereNotExists(function($query){
                $query->select(\DB::raw(1))
                    ->from('turnos')
                    ->whereRaw('turnos.conductor_id = conductores.id');
            })->where('conductores.empresa_id', $empresa_id)->get();
        return JsonResponse::create($con);
    }

    private function getRol($nombre)
    {
        return Rol::where('nombre', $nombre)->first();
    }
}