<?php

namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\NotificacionController;
use App\Model\Giro;
use App\Model\Incidencia;
use App\Model\Cliente;
use App\Model\Paquete;
use App\Model\Pasajero;
use App\Model\Turno;
use App\Model\Viaje;
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
                $nombrefile = $_SERVER['SERVER_NAME'].'/images/conductores/'."conductor$id.png";
//                \Storage::disk('local')->put("conductor$id.png",  \File::get($file));
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
        $conductor->load('empresa');
        $conductor->load('vehiculo');
        return $conductor;
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
            $data = $request->json()->all();
            unset($data['empresa']);
            unset($data['vehiculo']);
            $conductor = Conductor::find($id);

            if($conductor){
//                actualizo los campos del conductor
                foreach($data as $campo=>$valor){
                    $conductor->$campo = $valor;
                }
                if($conductor->save()){
                    if($request->estado == 'Disponible'){
                        \App::make('\App\Events\UpdatedEstadoConductorEvent')->enviarNotificacion("Notificacion", "El conductor $conductor->nombres"." $conductor->apellidos se ha reportado como $conductor->estado", $conductor, $conductor->central_id);
                    }else{
                        \App::make('\App\Events\UpdatedEstadoConductorEvent')->enviarNotificacion("Notificacion", "El conductor $conductor->nombres"." $conductor->apellidos se ha reportado como $conductor->estado", $conductor, $conductor->central_id);
                    }
                    return JsonResponse::create(array('message' => "Actualizado Correctamente"), 200);
                }else {
                    return JsonResponse::create(array('message' => "No se pudo actualizar el registro"), 400);
                }
            }else{
                return response()->json(['mensaje' => 'El conductor no existe'], 400);
            }

        }catch(Exception $e){
            return JsonResponse::create(array('message' => "Se produjo una exepcion", "exception"=>$e->getMessage()), 401);
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
        $conductor = Conductor::find($id);
        if($conductor){
            $usuario = $conductor->usuario;
            $conductor->activo = 0;
            $usuario->estado = -1;
            $conductor->save();
            $usuario->save();
            return response()->json(['message' => 'Conductor inhabilitado'], 201);
        }else{
            return response()->json(['message' => 'El conductor no existe'], 400);
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
            }
            return JsonResponse::create(array('message' => "Se asigno el vehiculo correctametne."), 200);
        }else{
            return JsonResponse::create(array('message' => "La placa del vehiculo ya se encuentra registrada."), 200);
        }
    }

    public function postUbicacion(Request $request, $conductor_id){
        $data = $request->all();

        $busqueda = \DB::table('ubicacion_conductor')
            ->select('conductor_id')
            ->where('conductor_id', $conductor_id)
            ->first();
        if($busqueda == null){
            \DB::table('ubicacion_conductor')->insert(
                array('conductor_id' => $conductor_id, 'latitud' => $data['latitud'], 'longitud' => $data['longitud'])
            );
        }else{
            DB::table('ubicacion_conductor')->where('conductor_id', $conductor_id)
                ->update(['latitud' => $data['latitud'], 'longitud' => $data['longitud']]);
        }
        \DB::update('UPDATE ubicacion_conductor, turnos
          SET ubicacion_conductor.ruta_id = turnos.ruta_id
          WHERE ubicacion_conductor.conductor_id = turnos.conductor_id;');
        //event recargar marker
        \App::make('\App\Events\RecargarMarcadorConductorEvent')->broadcastOn($conductor_id, $data['latitud'], $data['longitud'] );
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

    public function getUbicacionConductor($conductor_id){
        $busqueda = Turno::where('conductor_id', $conductor_id)->first();
        return $busqueda;

    }

    public function deleteUbicacion($conductor_id){
        $busqueda = Ubicacion::where('conductor_id', $conductor_id);
        if($busqueda->delete()){
            return JsonResponse::create(array('message' => 'Eliminado de la ubicacion'));
        }{
            return JsonResponse::create(array('message' => 'Error al eliminar de la ubicacion'));
        }
    }

    public function updateRegId($conductor_id, $reg_id){
        $conductor = Conductor::find($conductor_id)->usuario;
        $conductor->reg_id = $reg_id;
        if($conductor->save()){
         return JsonResponse::create(array('reg_id' => $reg_id, 'Actualizado'));
        }else{
            return JsonResponse::create(array('reg_id' => $reg_id, 'Error'));
        }
    }

    public function getCupos($conductor_id){
        list($total) = DB::table('vehiculos')->select(
            DB::raw('( (cupos) - (select count(conductor_id) from pasajeros where conductor_id ='.$conductor_id.' and estado = "Asignado") ) as total'))
            ->where('conductor_id', $conductor_id)->get('total');

        return $total->total;
    }

    public function storeIncidencia(Request $request, $conductor_id)
    {
        $data = $request->all();
        $conductor = Conductor::find($conductor_id);
        if($conductor){
            $data['fecha'] = date("Y-m-d H:i:s");
            if(!$conductor->incidencias()->save(new Incidencia($data))){
                return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
            }
            $conductor->estado = 'Ausente';
            if($conductor->save()) {
                \App::make('\App\Events\UpdatedEstadoConductorEvent')->enviarNotificacion("Notificacion", "El conductor $conductor->nombres"." $conductor->apellidos se ha reportado como $conductor->estado", $conductor, $conductor->central_id);
            }
            return JsonResponse::create(array('message' => "estado del conductor actualizado"), 200);
        }else{
            return JsonResponse::create(array('messageError' => 'no es posible encontrar al conductor'));
        }
    }

    public function getIncidencias($conductor_id)
    {
        return Conductor::find($conductor_id)->incidencias;
    }

    public function UltimaIncidencias($conductor_id)
    {
        return Conductor::find($conductor_id)->incidencias()->orderBy('fecha', 'desc')->whereNull('fecha_fin')->first();
    }

    public function finalizarIncidencia($conductor_id, $inc_id)
    {
        $conductor = Conductor::find($conductor_id);
        $conductor->estado = 'Disponible';
        $inc = Incidencia::find($inc_id);
        $inc->fecha_fin = date("Y-m-d H:i:s");
        if($inc->save() && $conductor->save()){
            \App::make('\App\Events\UpdatedEstadoConductorEvent')->enviarNotificacion("Notificacion", "El conductor $conductor->nombres"." $conductor->apellidos se ha reportado como $conductor->estado", $conductor, $conductor->central_id);
            return JsonResponse::create(array('message' => "estado del conductor actualizado"), 200);
        }else{
            return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
        }
    }

    public function cdisponibles(){
        return JsonResponse::create(Conductor::where('estado', 'Disponible')->count());
    }

    public function cantidadturnos(){
        return JsonResponse::create(Turno::count());
    }

    public function causentes(){
        return JsonResponse::create(Conductor::where('estado', 'Ausente')->count());
    }

    public function bpasajeros(){
        return JsonResponse::create(Conductor::where('estado', 'En ruta')->count());
    }

    public function enviarNotificacionBusquedaClientes(Request $request){
        $noty = new NotificacionController();

        $pasajero = Pasajero::where('identificacion', $request['identificacion'])->where('estado', 'Asignado')->first();
        $mensaje = 'En conductor a marcado que ira a recogerte, llegara en cualquier momento.';
            if($noty->enviarNotificacionClientes($mensaje, $request['identificacion'], 'Busqueda')){
            $pasajero->estado = 'En busqueda';
            if($pasajero->save())
                return 'true';
            else
                return 'false';
        }else{
            return 'No es posible notificar a este cliente';
        }
    }

    public function enviarNotificacionBusquedaGirosPaquetes(Request $request){
        $noty = new NotificacionController();

        $mensaje = 'En conductor a marcado que ira a recoger tu pedido, llegara en cualquier momento.';
        if($request['tipo'] == 'giro'){
            $giro = Giro::where('ide_remitente', $request['identificacion'])->where('estado', 'En espera')->first();
            if($noty->enviarNotificacionClientes($mensaje, $request['identificacion'], 'Busqueda')){
                $giro->estado = 'En busqueda';
                if($giro->save())
                    return 'true';
                else
                    return 'false';
            }else{
                return JsonResponse::create('No es posible notificar a este cliente');
            }
        }else{
            $paquete = Paquete::where('ide_remitente', $request['identificacion'])->where('estado', 'En espera')->first();
            if($noty->enviarNotificacionClientes($mensaje, $request['identificacion'], 'Busqueda')){
                $paquete->estado = 'En busqueda';
                if($paquete->save())
                    return 'true';
                else
                    return 'false';
            }else{
                return JsonResponse::create('No es posible notificar a este cliente');
            }
        }
    }

    public function finalizarBusquedaPGP(Request $request){
        if($request['tipo'] == 'giro'){
            $giro = Giro::find($request['id']);
            if($giro){
                $giro->estado = 'En ruta';
                if($giro->save())
                    return JsonResponse::create('Giro correcto');
                else
                    return JsonResponse::create('Giro falso');
            }else{
                return JsonResponse::create('No se encontro el id para este '.$request['tipo']);
            }
        }else if($request['tipo'] == 'paquete'){
            $paquete = Paquete::find($request['id']);
            if($paquete){
                $paquete->estado = 'En ruta';
                if($paquete->save())
                    return JsonResponse::create('Paquete correcto');
                else
                    return JsonResponse::create('Paquete falso');
            }else{
                return JsonResponse::create('No se encontro el id para este '.$request['tipo']);
            }
        }else if($request['tipo'] == 'pasajero'){
            $pasajero = Pasajero::find($request['id']);
            if ($pasajero){
                $pasajero->estado = 'En ruta';
                if($pasajero->save())
                    return JsonResponse::create('Pasajero correcto');
                else
                    return JsonResponse::create('Pasajero falso');
            }else{
                return JsonResponse::create('No se encontro el id para este '.$request['tipo']);
            }
        }
    }

    public function finalizarViaje(Request $request){
        $noty = new NotificacionController();
        $conductor = DB::table('viajes')->where('conductor_id', $request['id'])->where('estado', 'En ruta')->first();
        if ($conductor){
            $viaje = Viaje::find($conductor->id);
            if($viaje){
                if($viaje->update(['estado' => 'Finalizado'])){
                    foreach ($viaje->pasajeros as $pasajero){
                        $pasajero->estado = 'Finalizado';
                        if ($pasajero->save()){
                            $viaje['datos']  = DB::table('datos_solicitudes_pasajeros')->where('identificacion', $pasajero->identificacion)
                                ->join('solicitudes_cliente', 'datos_solicitudes_pasajeros.solicitud_id', '=', 'solicitudes_cliente.id')
                                ->select('solicitudes_cliente.estado', 'solicitudes_cliente.id', 'solicitudes_cliente.cliente_id')
                                ->where('solicitudes_cliente.estado', '<>', 'f')->get();
                            foreach ($viaje['datos'] as $dato){
                                DB::table('solicitudes_cliente')
                                    ->where('id', $dato->id)
                                    ->update(['estado' => 'f']);
                                $noty->enviarNotificacionClientes('Finalizo su solicitud, gracias por haber echo uso de nuestro servicio', $dato->cliente_id, 'Finalizado');
                            }
                        }
                    }
                    foreach ($viaje->giros as $giro){
                        $giro->estado = 'Finalizado';
                        if ($giro->save()){
                            $viaje['datos']  = DB::table('datos_solicitudes_girospaquetes')
                                ->join('solicitudes_cliente', 'datos_solicitudes_girospaquetes.solicitud_id', '=', 'solicitudes_cliente.id')
                                ->join('clientes', 'solicitudes_cliente.cliente_id', '=', 'clientes.id')
                                ->join('giros', 'datos_solicitudes_girospaquetes.destinatario', '=', 'giros.nombre_receptor')
                                ->select('solicitudes_cliente.id', 'solicitudes_cliente.estado', 'solicitudes_cliente.cliente_id', 'clientes.identificacion')
                                ->where('clientes.identificacion', $giro->ide_remitente)
                                ->where('solicitudes_cliente.tipo', 'giro')
                                ->where('solicitudes_cliente.estado', '<>', 'f')
                                ->get();
                            foreach ($viaje['datos'] as $dato){
                                DB::table('solicitudes_cliente')
                                    ->where('id', $dato->id)
                                    ->update(['estado' => 'f']);
                                $noty->enviarNotificacionClientes('Finalizo su solicitud, gracias por haber echo uso de nuestro servicio', $dato->cliente_id, 'Finalizado');
                            }
                        }
                    }
                    foreach ($viaje->paquetes as $paquete){
                        $paquete->estado = 'Finalizado';
                        if ($paquete->save()){
                            $viaje['datos']  = DB::table('datos_solicitudes_girospaquetes')
                                ->join('solicitudes_cliente', 'datos_solicitudes_girospaquetes.solicitud_id', '=', 'solicitudes_cliente.id')
                                ->join('clientes', 'solicitudes_cliente.cliente_id', '=', 'clientes.id')
                                ->join('paquetes', 'datos_solicitudes_girospaquetes.destinatario', '=', 'paquetes.nombre_receptor')
                                ->select('solicitudes_cliente.id', 'solicitudes_cliente.estado', 'solicitudes_cliente.cliente_id', 'clientes.identificacion')
                                ->where('clientes.identificacion', $paquete->ide_remitente)
                                ->where('solicitudes_cliente.tipo', 'paquete')
                                ->where('solicitudes_cliente.estado', '<>', 'f')
                                ->get();
                            foreach ($viaje['datos'] as $dato){
                                DB::table('solicitudes_cliente')
                                    ->where('id', $dato->id)
                                    ->update(['estado' => 'f']);
                                $noty->enviarNotificacionClientes('Finalizo su solicitud, gracias por haber echo uso de nuestro servicio', $dato->cliente_id, 'Finalizado');
                            }
                        }
                    }

                }
            }else{
                return JsonResponse::create('No existe un viaje para esta id');
            }
        }else{
            return JsonResponse::create('No se encontro el viaje asociado al conductor');
        }
        return JsonResponse::create($viaje);
    }
}
