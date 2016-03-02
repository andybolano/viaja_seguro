<?php namespace App\Http\Controllers\Empresa;

use App\Model\Central;
use App\Model\Ciudad;
use App\Model\Empresa;
use App\Model\Municipio;
use App\Model\Rol;
use App\Model\Usuario;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;

class CentralesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($empresa_id)
    {
        if ($ciudad = Input::get('ciudad'))
            return $this->getByCiudad($ciudad);
        try{
            $centrales = Empresa::find($empresa_id)->centrales;
            foreach($centrales as $central) {
                $central->ciudad->load('departamento');
            }
            $centrales->load('usuario');
            return $centrales;
        }catch(\Exception $e){
            return response()->json(array("exception"=>$e->getMessage()), 400);
        }
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
            $ciudad = Municipio::find($data['ciudad']['codigo']);
            unset($data['ciudad']);
            $data_usuario = $data['usuario'];
            unset($data['usuario']);
            $usuario = Usuario::nuevo($data_usuario['nombre'], $data_usuario['contrasena'], $this->getRol()->id);
            $data['usuario_id'] = $usuario->id;
            $central = new Central($data);
            $central->ciudad()->associate($ciudad);
            if(!Empresa::find($empresa_id)->centrales()->save($central)){
                return response()->json(['mensajeError' => 'no se ha podido almacenar el usuario'], 400);
                $usuario->delete();
            }
            return response()->json($central, 201);
        } catch (\Exception $exc) {
            $usuario->delete();
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function show($codigo)
    {
        //
    }

    public function getByCiudad($ciudad)
    {
        $central = Central::whereHas('ciudad', function($query) use ($ciudad) {
            return $query->where('nombre', $ciudad);
        })->first();
        $central->ciudad->load('departamento');
        return $central;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int $central_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $central_id)
    {
        try{
            if($central = Central::find($central_id)) {
                $data = $request->json()->all();
                $central->miDireccionLa = $data['miDireccionLa'];
                $central->miDireccionLo = $data['miDireccionLo'];
                $central->direccion = $data['direccion'];
                $central->telefono = $data['telefono'];
                $central->save();
                return response()->json(['mensaje' => 'registro actualizado'], 201);
            }else{
                return response()->json(['mensaje' => 'la central no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage(), ''=>$exc->getLine()), 400);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $central_id
     * @return \Illuminate\Http\Response
     */
    public function destroy($central_id)
    {
        try{
            $central = Central::find($central_id);
            if($central){
                $usuario = $central->usuario;
                $central->delete();
                $usuario->delete();
                return response()->json(['mensaje' => 'registro eliminado'], 201);
            }else{
                return response()->json(['mensaje' => 'la central no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage(), ''=>$exc->getLine()), 400);
        }

    }

    public function getRutas($id)
    {
        $central = Central::find($id);
        $rutas = [];
        foreach ($central->rutas as $ruta) {
            $rutas[] = [
                'id' => $ruta->id,
                //'origen' => $ruta->origen->load('ciudad'),
                'destino' => $ruta->destino->load('ciudad'),
                'turnos' => $ruta->turnos->load('conductor')
            ];
        }
        return $rutas;
    }

    public function getConductores($id)
    {
        $conductores = [];
        foreach (Central::find($id)->conductores as &$conductor) {
            if($conductor->activo) {
                if ($conductor->central) {
                    $conductor->central->load('ciudad');
                    $conductor->load('vehiculo');
                }
                $conductores[] = $conductor;
            }
        }
        return $conductores;
    }

    public function getVehiculos($id)
    {
        $vehiculos = Central::find($id)->vehiculos;
        $vehiculos->load('conductor');
        $arr = [];
        foreach ($vehiculos as &$vehiculo) {
            if($vehiculo->conductor->activo) {
                $arr[] = $vehiculo;
            }
        }
        return $arr;
    }

    private function getRol()
    {
        return Rol::where('nombre', 'CENTRAL_EMPRESA')->first();
    }

    public function getSolicitudesPasajeros($central_id)
    {
        return Central::find($central_id)->solicitudes()
            ->where(['tipo'=> 'vehiculo', 'estado'=> 'p'])->get()->load('datos_pasajeros');
    }

}
