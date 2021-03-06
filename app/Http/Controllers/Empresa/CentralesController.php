<?php namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\NotificacionController;
use App\Model\Central;
use App\Model\Cliente;
use App\Model\DataSolicitudGiroPaquete;
use App\Model\DataSolicitudPasajero;
use App\Model\Giro;
use App\Model\Paquete;
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
        try {
            $centrales = Empresa::find($empresa_id)->centrales;
            foreach ($centrales as $central) {
                $central->ciudad->load('departamento');
            }
            $centrales->load('usuario');
            return $centrales;
        } catch (\Exception $e) {
            return response()->json(array("exception" => $e->getMessage()), 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $empresa_id)
    {
        try {
            $data = $request->json()->all();
            $ciudad = Municipio::find($data['ciudad']['codigo']);
            unset($data['ciudad']);
            $data_usuario = $data['usuario'];
            unset($data['usuario']);
            $usuario = Usuario::nuevo($data_usuario['nombre'], $data_usuario['contrasena'], $this->getRol()->id);
            $data['usuario_id'] = $usuario->id;
            $central = new Central($data);
            $central->ciudad()->associate($ciudad);
            if (!Empresa::find($empresa_id)->centrales()->save($central)) {
                return response()->json(['mensajeError' => 'no se ha podido almacenar el usuario'], 400);
                $usuario->delete();
            }
            return response()->json($central, 201);
        } catch (\Exception $exc) {
            $usuario->delete();
            return response()->json(array("exception" => $exc->getMessage()), 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int $codigo
     * @return \Illuminate\Http\Response
     */
    public function show($codigo)
    {
        //
    }

    public function getByCiudad($ciudad)
    {
        $central = Central::whereHas('ciudad', function ($query) use ($ciudad) {
            return $query->where('nombre', $ciudad);
        })->first();
        $central->ciudad->load('departamento');
        return $central;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $central_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $central_id)
    {
        try {
            if ($central = Central::find($central_id)) {
                $data = $request->json()->all();
                $central->miDireccionLa = $data['miDireccionLa'];
                $central->miDireccionLo = $data['miDireccionLo'];
                $central->direccion = $data['direccion'];
                $central->telefono = $data['telefono'];
                $central->save();
                return response()->json(['mensaje' => 'registro actualizado'], 201);
            } else {
                return response()->json(['mensaje' => 'la central no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception" => $exc->getMessage(), '' => $exc->getLine()), 400);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $central_id
     * @return \Illuminate\Http\Response
     */
    public function destroy($central_id)
    {
        try {
            $central = Central::find($central_id);
            if ($central) {
                $usuario = $central->usuario;
                $central->delete();
                $usuario->delete();
                return response()->json(['mensaje' => 'registro eliminado'], 201);
            } else {
                return response()->json(['mensaje' => 'la central no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception" => $exc->getMessage(), '' => $exc->getLine()), 400);
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
                'solicitud_nuevos_pasajeros' => $ruta->solicitudes()
                    ->where(['tipo' => 'pasajero', 'estado' => 'p'])->get()->load('datos_pasajeros'),
                'solicitud_pasajeros' => $ruta->solicitudes()
                    ->where(['tipo' => 'vehiculo', 'estado' => 'p'])->get()->load('datos_pasajeros'),
                'solicitud_paquetes' => $ruta->solicitudes()
                    ->where(['tipo' => 'paquete', 'estado' => 'p'])->get()->load('detalles'),
                'solicitud_giros' => $ruta->solicitudes()
                    ->where(['tipo' => 'giro', 'estado' => 'p'])->get()->load('detalles')

            ];
        }
        return $rutas;
    }

    public function getConductores($id)
    {
        $conductores = [];
        foreach (Central::find($id)->conductores as &$conductor) {
            if ($conductor->activo) {
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
            if ($vehiculo->conductor->activo) {
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
            ->where(['tipo' => 'vehiculo', 'estado' => 'p'])->get()->load('datos_pasajeros');
    }

    public function getSolicitudesPaquetes($central_id)
    {
        return Central::find($central_id)->solicitudes()
            ->where(['tipo' => 'paquete', 'estado' => 'p'])->get()->load('detalles');
    }

    public function getSolicitudesGiros($central_id)
    {
        return Central::find($central_id)->solicitudes()
            ->where(['tipo' => 'giro', 'estado' => 'p'])->get()->load('detalles');
    }

    public function getSolicitudPasajero($solicitud_id)
    {
        $i = 0;
        $solicitud = Solicitud::find($solicitud_id)->load('datos_pasajeros');
        $solicitud['ruta'] = Ruta::find($solicitud->ruta_id);
        $solicitud['ruta']['destino'] = Central::find($solicitud['ruta']->id_central_destino)->ciudad;
        $solicitud['conductores'] = Ruta::find($solicitud->ruta_id)->turnos->load('conductor');
        foreach ($solicitud['conductores'] as $cupos) {
            list($total) = DB::table('vehiculos')->select(
                DB::raw('( (cupos) - (select count(conductor_id) from pasajeros where conductor_id =' . $cupos->conductor_id . ' and estado = "Asignado") ) as total'))
                ->where('conductor_id', $cupos->conductor_id)->get('total');
            $solicitud['conductores'][$i]['cupos'] = $total->total;
            $i++;
        }
        return JsonResponse::create($solicitud);
    }

    public function getSolicitudPaquete($solicitud_id)
    {
        $i = 0;
        $solicitud = Solicitud::find($solicitud_id)->load('detalles');
        $solicitud['ruta'] = Ruta::find($solicitud->ruta_id);
        $solicitud['ruta']['destino'] = Central::find($solicitud['ruta']->id_central_destino)->ciudad;
        $solicitud['conductores'] = Ruta::find($solicitud->ruta_id)->turnos->load('conductor');
        foreach ($solicitud['conductores'] as $cupos) {
            list($total) = DB::table('vehiculos')->select(
                DB::raw('( (cupos) - (select count(conductor_id) from pasajeros where conductor_id =' . $cupos->conductor_id . ' and estado = "Asignado") ) as total'))
                ->where('conductor_id', $cupos->conductor_id)->get('total');
            $solicitud['conductores'][$i]['cupos'] = $total->total;
            $i++;
        }
        return JsonResponse::create($solicitud);
    }

    public function getSolicitudGiro($solicitud_id)
    {
        $i = 0;
        $solicitud = Solicitud::find($solicitud_id)->load('detalles');
        $solicitud['ruta'] = Ruta::find($solicitud->ruta_id);
        $solicitud['ruta']['destino'] = Central::find($solicitud['ruta']->id_central_destino)->ciudad;
        $solicitud['conductores'] = Ruta::find($solicitud->ruta_id)->turnos->load('conductor');
        foreach ($solicitud['conductores'] as $cupos) {
            list($total) = DB::table('vehiculos')->select(
                DB::raw('( (cupos) - (select count(conductor_id) from pasajeros where conductor_id =' . $cupos->conductor_id . ' and estado = "Asignado") ) as total'))
                ->where('conductor_id', $cupos->conductor_id)->get('total');
            $solicitud['conductores'][$i]['cupos'] = $total->total;
            $i++;
        }
        return JsonResponse::create($solicitud);
    }


    public function aceptarSolicitudPasajero(Request $request, $id)
    {
        $noty = new NotificacionController();
        $solicitud = Solicitud::find($id);
        if ($solicitud->load('cliente')) {
            $solicitud->estado = 'a';
            $solicitud->conductor_id = $request->conductor_id;
            if ($solicitud->save()) {
                if ($solicitud->tipo != 'vehiculo') {
                    $mensaje = 'Su solicitud de vehiculo a sido aceptada, espere a que el vehiculo lo recoja';
                } else {
                    $mensaje = 'Su solicitud a sido acepta, por favor espere a que el vehiculo recoja su pedido';
                }
                $noty->enviarNotificacionClientes($mensaje, $solicitud->cliente_id, 'Confirmacion');

                return JsonResponse::create(array('message' => 'Solicitud aprovada', $this->moverPedidoSolicitud($id)));
            } else {
                return JsonResponse::create(array('message' => 'No se pudo aprovar la solicitud'));
            }
        } else {
            $solicitud->estado = 'a';
            $solicitud->conductor_id = $request->conductor_id;
            if ($solicitud->save()) {
                return JsonResponse::create(array('message' => 'Solicitud aprovada', $this->moverPedidoSolicitud($id)));
            } else {
                return JsonResponse::create(array('message' => 'No se pudo aprovar la solicitud'));
            }
        }
    }

    public function moverPedidoSolicitud($solicitud_id)
    {
        $solicitud = Solicitud::find($solicitud_id);
        $noty = new NotificacionController();
        if ($solicitud->tipo == 'vehiculo') {
            $cliente = $solicitud->load('cliente');
            if ($cliente) {
                $solicitud->load('datos_pasajeros');
                foreach ($solicitud->datos_pasajeros as $pasajero) {
                    $p = new Pasajero();
                    $p->identificacion = $pasajero->identificacion;
                    $p->nombres = $pasajero->nombre;
                    $p->direccion = "$solicitud->ciudad_direccion" . " $solicitud->direccion_recogida";
                    $p->conductor_id = $solicitud->conductor_id;
                    $p->central_id = $solicitud->central_id;
                    $p->telefono = $solicitud->cliente->telefono;
                    $p->estado = 'Asignado';
                    if ($p->save()) {
                        json_decode($noty->enviarNotificacionConductores('Se te asigno un nuevo pasajero', $solicitud->conductor_id, 'Pasajeros'));
                    }
                }
            }
        }
        if ($solicitud->tipo == 'paquete') {
            $p = new Paquete();
            $solicitud->load('detalles', 'cliente');
            foreach ($solicitud->detalles as $detalle) {
                $p->conductor_id = $solicitud->conductor_id;
                $p->central_id = $solicitud->central_id;
                $p->ide_remitente = $solicitud->cliente->identificacion;
                $p->nombres = $solicitud->cliente->nombres . $solicitud->cliente->apellidos;
                $p->telefono = $solicitud->cliente->telefono;
                $p->direccion = "$solicitud->ciudad_direccion" . " $solicitud->direccion_recogida";
                $p->nombre_receptor = $detalle->destinatario;
                $p->telefono_receptor = $detalle->telefono;
                $p->direccionD = $detalle->direccion;
                $p->descripcion_paquete = $detalle->descripcion;
                if ($p->save()) {
                    $noty->enviarNotificacionConductores('Se te asigno un nuevo paquete', $solicitud->conductor_id, 'Paquete');
                }
            }
        }
        if ($solicitud->tipo == 'giro') {
            $g = new Giro();
            $solicitud->load('detalles', 'cliente');
            foreach ($solicitud->detalles as $detalle) {
                $g->conductor_id = $solicitud->conductor_id;
                $g->central_id = $solicitud->central_id;
                $g->ide_remitente = $solicitud->cliente->identificacion;
                $g->nombres = $solicitud->cliente->nombres . $solicitud->cliente->apellidos;
                $g->telefono = $solicitud->cliente->telefono;
                $g->direccion = "$solicitud->ciudad_direccion" . " $solicitud->direccion_recogida";
                $g->nombre_receptor = $detalle->destinatario;
                $g->telefono_receptor = $detalle->telefono;
                $g->direccionD = $detalle->direccion;
                $g->monto = $detalle->descripcion;
                if ($g->save()) {
                    json_decode($noty->enviarNotificacionConductores('Se te asigno un nuevo giro', $solicitud->conductor_id, 'Giro'));
                }
            }
        }
        if ($solicitud->tipo == 'pasajero') {
            if ($solicitud->load('datos_pasajeros')) {
                foreach ($solicitud->datos_pasajeros as $pasajero) {
                    $p = new Pasajero();
                    $p->identificacion = $pasajero->identificacion;
                    $p->nombres = $pasajero->nombre;
                    $p->direccion = "$solicitud->ciudad_direccion" . " $solicitud->direccion_recogida";
                    $p->conductor_id = $solicitud->conductor_id;
                    $p->central_id = $solicitud->central_id;
                    $p->telefono = $pasajero->telefono;
                    $p->estado = 'Asignado';
                    if ($p->save()) {
                        json_decode($noty->enviarNotificacionConductores('Se te asigno un nuevo pasajero', $solicitud->conductor_id, 'Pasajeros'));
                    }
                }
            }
        }
    }

    public function rechazarSolicitud(Request $request, $solicitud_id)
    {
        $noty = new NotificacionController();
        $solicitud = Solicitud::find($solicitud_id);
        $solicitud->estado = 'r';
        $message = $request->causa_rechazo;
        $solicitud->causa_rechazo = $message;
        if ($solicitud->save()) {
            $noty->enviarNotificacionClientes($message, $solicitud->cliente_id, 'Rechazo');
            return JsonResponse::create(array('message' => 'Se rechazo la solicitud correctamente'));
        } else {
            return JsonResponse::create(array('message' => 'Ocurrio un error al rechazar la solicitud '));
        }
    }

    function getConductoresEnRuta($central)
    {
        $central = Central::find($central);
        $rutas = [];
        foreach ($central->rutas as $ruta) {
            $rutas[] = [
                'id' => $ruta->id,
                //'origen' => $ruta->origen->load('ciudad'),
                'destino' => $ruta->destino->load('ciudad'),
                'turnos' => $ruta->turnos->load('conductor'),
            ];
        }
        return $rutas;
    }

    public function getDeducciones($central_id)
    {
        $central = Central::with('deducciones')->where('id', $central_id)->first();
        $arr = [];
        foreach ($central->deducciones as $deduccion) {
            $arr[] = $deduccion->pivot;
        }
        return $arr;
    }

    public function getTotalDeducciones($central_id, $dia)
    {
        $dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        $valor = 'valor_' . $dias[$dia];
        $central = Central::with('deducciones')->where('id', $central_id)->first();
        $arr = [
            'cobors' => [],
            'total' => 0
        ];
        foreach ($central->deducciones as $deduccion) {
            if ($deduccion->estado) {
                $arr['cobors'][] = ['nombre' => $deduccion->nombre, 'valor' => $deduccion->pivot->$valor];
                $arr['total'] += $deduccion->pivot->$valor;
            }
        }
        return $arr;
    }

    public function setDeducciones(Request $request, $central_id)
    {
        try {
            DB::beginTransaction();
            $central = Central::find($central_id);
            $data = $request->json()->all();
            $arr = [];
            foreach ($data as $item) {
                $arr[$item['id']] = [
                    'valor_lunes' => $item['valor_lunes'],
                    'valor_martes' => $item['valor_martes'],
                    'valor_miercoles' => $item['valor_miercoles'],
                    'valor_jueves' => $item['valor_jueves'],
                    'valor_viernes' => $item['valor_viernes'],
                    'valor_sabado' => $item['valor_sabado'],
                    'valor_domingo' => $item['valor_domingo']
                ];
            }
            $central->deducciones()->sync($arr);
            DB::commit();
            return response()->json(201);
        } catch (\Exception $exc) {
            DB::rollback();
//            return response()->json(["exception"=>$exc->getMessage()], 500);
        }

    }

    private function verificarCliente($identificacion)
    {
        return Cliente::where('identificacion', $identificacion)->first();

    }

    private function crearUsuarioPasajero($identificacion)
    {
        return Usuario::nuevo($identificacion, $identificacion, $this->getRol('CLIENTE')->id);
    }

    /**
     * @param $pasajero
     * @return bool
     */
    private function createNewClienteSiNoExiste($data)
    {
        $cliente = new Cliente();
        $pasajero = $data['pasajeros'];
        unset($data['pasajeros']);
        $usuario = $this->crearUsuarioPasajero($pasajero['identificacion']);
        if($usuario){
            $cliente->identificacion = $pasajero['identificacion'];
            $cliente->nombres = $pasajero['nombre'];
            $cliente->telefono = $pasajero['telefono'];
            $cliente->direccion = $data['ciudad_direccion'].' '.$data['direccion_recogida'];
            $cliente->usuario_id = $usuario->id;
            if($cliente->save()){
                return $cliente;
            }else{
                $usuario->delete();
            }
        }
    }

    private function createSolicitudNewPasajeros($data)
    {
        $pasajero = $data['pasajeros'];
        unset($data['pasajeros']);
        $solicitud = new Solicitud($data);
        if ($solicitud->save()) {
            $solicitud->datos_pasajeros()->save(new DataSolicitudPasajero($pasajero));
            \App::make('\App\Events\NuevaSolicitudEvent')->enviarNotificacion($data['tipo'], 'Existe una nueva solicitud, verificala en la seccion de despacho', $data['central_id']);
            return response()->json($solicitud->id, 200);
        } else {
            return response()->json(['menssage' => 'No se ha podido almacenar la solicitud'], 400);
        }
    }

    public function addNewSolicitudPasajero(Request $request)
    {
        $data = $request->json()->all();
        if ($data['tipo'] == 'pasajero') {
            if ($this->verificarCliente($data['pasajeros']['identificacion'])) {
                return $this->createSolicitudNewPasajeros($data);
            } else {
                $pasajero = $data['pasajeros'];
                $cliente = $this->createNewClienteSiNoExiste($data);
                if ($cliente){
                    return $this->createSolicitudNewPasajeros($data);
                }
            }
        }
    }

    private function createSolicitudNewGiros($data, $cliente)
    {
        $giro = $data['giros'];
        unset($data['giros']);
        $data['cliente_id'] = $cliente;
        $solicitud = new Solicitud($data);
        if ($solicitud->save()) {
            $solicitud->datos_giros_paquetes()->save(new DataSolicitudGiroPaquete($giro));
            \App::make('\App\Events\NuevaSolicitudEvent')->enviarNotificacion($data['tipo'], 'Existe una nueva solicitud, verificala en la seccion de despacho', $data['central_id']);
            return response()->json($solicitud->id, 200);
        } else {
            return response()->json(['menssage' => 'No se ha podido almacenar la solicitud'], 400);
        }
    }

    public function addNewSolicitudGiro(Request $request)
    {
        $data = $request->json()->all();
        $cliente = $data['giros']['cliente_id'];
        $data['giros']['identificacion'] = $data['giros']['ide_remitente'];
        $data['giros']['destinatario'] = $data['giros']['nombre_receptor'];
        $data['giros']['telefono'] = $data['giros']['telefono_receptor'];
        $data['giros']['direccion'] = $data['giros']['direccionD'];
        $data['giros']['descripcion'] = $data['giros']['monto'];
        unset($data['giros']['ide_remitente']);
        unset($data['giros']['nombres']);
        unset($data['giros']['nombre_receptor']);
        unset($data['giros']['telefono_receptor']);
        unset($data['giros']['direccionD']);
        unset($data['giros']['monto']);
        unset($data['giros']['cliente_id']);

        if ($data['tipo'] == 'giro') {
            if ($this->verificarCliente($data['giros']['identificacion'])) {
                return $this->createSolicitudNewgiros($data, $cliente);
            } else {
                $giro = $data['giros'];
                $cliente = $this->createNewClienteSiNoExiste($data);
                if ($cliente){
                    return $this->createSolicitudNewGiros($data, $cliente);
                }
            }
        }
    }

    private function createSolicitudNewPaquetes($data, $cliente)
    {
        $paquete = $data['paquetes'];
        unset($data['paquetes']);
        $data['cliente_id'] = $cliente;
        $solicitud = new Solicitud($data);
        if ($solicitud->save()) {
            $solicitud->datos_giros_paquetes()->save(new DataSolicitudGiroPaquete($paquete));
            \App::make('\App\Events\NuevaSolicitudEvent')->enviarNotificacion($data['tipo'], 'Existe una nueva solicitud, verificala en la seccion de despacho', $data['central_id']);
            return response()->json($solicitud->id, 200);
        } else {
            return response()->json(['menssage' => 'No se ha podido almacenar la solicitud'], 400);
        }
    }

    public function addNewSolicitudPaquete(Request $request)
    {
        $data = $request->json()->all();
        $cliente = $data['paquetes']['cliente_id'];
        $data['paquetes']['identificacion'] = $data['paquetes']['ide_remitente'];
        $data['paquetes']['destinatario'] = $data['paquetes']['nombre_receptor'];
        $data['paquetes']['telefono'] = $data['paquetes']['telefono_receptor'];
        $data['paquetes']['direccion'] = $data['paquetes']['direccionD'];
        unset($data['paquetes']['ide_remitente']);
        unset($data['paquetes']['nombres']);
        unset($data['paquetes']['nombre_receptor']);
        unset($data['paquetes']['telefono_receptor']);
        unset($data['paquetes']['direccionD']);
        unset($data['paquetes']['cliente_id']);
        unset($data['paquetes']['ide_remitente']);
        if ($data['tipo'] == 'paquete') {
            if ($this->verificarCliente($data['paquetes']['identificacion'])) {
                return $this->createSolicitudNewPaquetes($data, $cliente);
            } else {
                $paquete = $data['paquetes'];
                $cliente = $this->createNewClienteSiNoExiste($data);
                if ($cliente){
                    return $this->createSolicitudNewPaquetes($data, $cliente);
                }
            }
        }
    }
}
