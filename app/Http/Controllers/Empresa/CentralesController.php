<?php namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\NotificacionController;
use App\Model\Central;
use App\Model\Pasajero;
use App\Model\Ruta;
use App\Model\Empresa;
use App\Model\Municipio;
use App\Model\Rol;
use App\Model\Solicitud;
use App\Model\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use DB;
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
                'turnos' => $ruta->turnos->load('conductor'),
                'solicitudes'=> $ruta->solicitudes()
                ->where(['tipo'=> 'vehiculo', 'estado'=> 'p'])->get()->load('datos_pasajeros')
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

    public function getSolicitudPasajero($solicitud_id){
        $i = 0;
        $solicitud = Solicitud::find($solicitud_id)->load('datos_pasajeros');
        $solicitud['ruta'] = Ruta::find($solicitud->ruta_id);
        $solicitud['ruta']['destino'] = Central::find($solicitud['ruta']->id_central_destino)->ciudad;
        $solicitud['conductores'] = Ruta::find($solicitud->ruta_id)->turnos->load('conductor');
        foreach($solicitud['conductores'] as $cupos){
            list($total) = DB::table('vehiculos')->select(
                DB::raw('( (cupos) - (select count(conductor_id) from pasajeros where conductor_id ='.$cupos->conductor_id.' and estado = "En ruta") ) as total'))
                ->where('conductor_id', $cupos->conductor_id)->get('total');
            $solicitud['conductores'][$i]['cupos'] = $total->total;
            $i++;
        }
        return JsonResponse::create($solicitud);
    }


    public function aceptarSolicitudPasajero(Request $request, $id)
    {
        $solicitud = Solicitud::find($id)->load('cliente');
        $solicitud->estado = 'a';
        $solicitud->conductor_id = $request->conductor_id;
        if($solicitud->save()){
            $noty = new NotificacionController();
            $mensaje = 'Su solicitud a sido acepta, por favor espere a que el vehiculo la recoja';
            $noty->enviarNotificacionClientes($mensaje, $solicitud->cliente_id, 'Confirmacion');
            $this->moverPedidoSolicitud($id);
            return JsonResponse::create(array('message' => 'Solicitud aprovada'));
        }else{
            return JsonResponse::create(array('message' => 'No se pudo aprovar la solicitud'));
        }
    }

    public function moverPedidoSolicitud($solicitud_id){
        $solicitud = Solicitud::find($solicitud_id)->first();
        $solicitud->load('cliente');
        if($solicitud->tipo == 'vehiculo'){
            $p = new Pasajero();
            $solicitud->load('datos_pasajeros');

            foreach($solicitud->datos_pasajeros as $pasajero){
                $p->identificacion = $pasajero->identificacion;
                $p->nombres = $pasajero->nombre;
                $p->direccion = "$solicitud->ciudad_direccion"." $solicitud->direccion_recogida";
                $p->conductor_id = $solicitud->conductor_id;
                $p->central_id = $solicitud->central_id;
                $p->telefono = $solicitud->cliente->telefono;
                $p->save();
            }
        }
    }

    public function rechazarSolicitud(Request $request, $solicitud_id){
        $noty = new NotificacionController();
        $solicitud = Solicitud::find($solicitud_id);
        $solicitud->estado = 'r';
        $message = $request->causa_rechazo;
        $solicitud->causa_rechazo = $message;
        if($solicitud->save()){
            $noty->enviarNotificacionClientes($message, $solicitud->cliente_id,'Rechazo');
            return JsonResponse::create(array('message' => 'Se rechazo la solicitud correctamente'));
        }else{
            return JsonResponse::create(array('message' => 'Ocurrio un error al rechazar la solicitud '));
        }
    }
}
