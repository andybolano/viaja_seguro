<?php

namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\NotificacionController;
use App\Model\Conductor;
use App\Model\Paquete;
use App\Model\Giro;
use App\Model\Pasajero;
use App\Model\Planilla;
use App\Model\Ruta;
use App\Model\Viaje;
use DB;
use App\Model\Turno;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Mockery\CountValidator\Exception;

class ViajesController extends Controller
{
    public function getTurno($ruta_id){
        return Turno::select('*')->where('ruta_id', $ruta_id)->where('turno', 1)->first();

    }

    public function deleteTurno(Request $request){
        $data = $request->all();
//        unset($data['deducciones']);
        $deducciones = $data['deducciones'];
//        if(!DB::table('turnos')->where('ruta_id', $data['ruta_id'])->where('turno', $data['turno'] )->delete()){
//            return JsonResponse::create(array('message' => 'Error al eliminar'));
//        }else{
            return JsonResponse::create(array('message' => 'Despachado correctamente', 'viaje' => $this->crearViaje($data['conductor_id'], $data['ruta_id'], $deducciones)));
//        }

    }

    public function crearViaje($conductor_id, $ruta_id, $deducciones){
        $viaje = new Viaje();
        $totalD = 0;
        $noty = new NotificacionController();

        $viaje->conductor_id = $conductor_id;
        $viaje->ruta_id = $ruta_id;
        $viaje->fecha = date("Y-m-d");

        $pasajeros = Pasajero::select('*')->where('conductor_id', $conductor_id)->where('estado', '=', 'Asignado')->get();
        $giros = Giro::select('*')->where('conductor_id', $conductor_id)->where('estado', '=', 'Asignado')->get();
        $paquetes = Paquete::select('*')->where('conductor_id', $conductor_id)->where('estado', '=', 'Asignado')->get();

        if($viaje->save()){
            $noty->enviarNotificacionConductores('La central a autorizado tu salida, acercate a secretaria para recivir la planilla.', $conductor_id, 'Despacho');
            
            foreach ($pasajeros as $pasajero) {
                $viaje->pasajeros()->attach($pasajero['id']);
                $noty->enviarNotificacionClientes('El conductor a salido a recogerlo, pronto pasara por usted, sea paciente', $pasajero['identificacion'],'Busqueda');
                $viaje['datos']  = DB::table('datos_solicitudes_pasajeros')->where('identificacion', $pasajero->identificacion)
                    ->join('solicitudes_cliente', 'datos_solicitudes_pasajeros.solicitud_id', '=', 'solicitudes_cliente.id')
                    ->select('solicitudes_cliente.estado', 'solicitudes_cliente.id', 'solicitudes_cliente.cliente_id')
                    ->where('solicitudes_cliente.estado', '<>', 'f')->get();
                foreach ($viaje['datos'] as $dato){
                    DB::table('solicitudes_cliente')
                        ->where('id', $dato->id)
                        ->update(['estado' => 'v']);
                    $noty->enviarNotificacionClientes('El vehiculo a salido de la central, por favor se paciente', $dato->cliente_id, 'Vehiculo en camino');
                }
            }

            foreach ($giros as $giro) {
                $viaje->giros()->attach($giro['id']);
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
                        ->update(['estado' => 'v']);
                    $noty->enviarNotificacionClientes('El vehiculo a salido de la central, por favor se paciente', $dato->cliente_id, 'Vehiculo en camino');
                }
            }

            foreach ($paquetes as $paquete) {
                $viaje->paquetes()->attach($paquete['id']);
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
                        ->update(['estado' => 'v']);
                    $noty->enviarNotificacionClientes('El vehiculo a salido de la central, por favor se paciente', $dato->cliente_id, 'Vehiculo en camino');
                }
            }

            foreach($deducciones as $deduccion){
                $viaje->deducciones()->attach($deduccion['id']);
                if($deduccion['nombre'] == 'PASAJE'){
                    $valorP = $deduccion['valor'];
                }
                if($deduccion['nombre'] != 'PASAJE'){
                    $totalD += $deduccion['valor'];
                }
            }
            $total = $totalD + ((count($pasajeros) * $valorP));

            $this->crearPlanilla($viaje->id, $viaje->conductor_id, $total);
            $planilla = $this->generarDatosPlanilla($viaje->id);

            $estado = Conductor::find($viaje->conductor_id);
            $estado->estado = 'En ruta';
            $estado->save();

            return array('viaje' => $viaje, 'planilla' => $planilla);
        }else{
            return 'No se pudo crear el viaje';
        }
    }

    public function crearPlanilla($viaje_id, $conductor_id, $total){
        $central = Conductor::find($conductor_id)->first();

        $planilla = new Planilla();
        $planilla->viaje_id = $viaje_id;
        $planilla->central_id = $central->central_id;
        $planilla->total = $total;

        $planilla->numero_planilla = $this->generarNumeroPlanilla($conductor_id);
        if($planilla->save()){
            return JsonResponse::create('Se creo la planilla correctamente');
        }else{
            return JsonResponse::create('Error al crear la planilla');
        }
    }

    public function generarDatosPlanilla($viaje){
        $consulta = Planilla::select('*')->where('viaje_id', $viaje)->first()->load('viaje', 'central');
        $consulta['giros'] = \DB::table('giros')->join('viaje_giros', 'giros.id', '=', 'viaje_giros.giro_id')
            ->join('viajes', 'viaje_giros.viaje_id', '=', 'viajes.id')
            ->where('viajes.id', $viaje)->select('*')->get();
        $consulta['pasajeros'] = \DB::table('pasajeros')->join('viaje_pasajeros', 'pasajeros.id', '=', 'viaje_pasajeros.pasajero_id')
            ->where('viajes.id', $viaje)->join('viajes', 'viaje_pasajeros.viaje_id', '=', 'viajes.id')->select('*')->get();
        $consulta['paquetes'] = \DB::table('paquetes')->join('viaje_paquetes', 'paquetes.id', '=', 'viaje_paquetes.paquete_id')
            ->where('viajes.id', $viaje)->join('viajes', 'viaje_paquetes.viaje_id', '=', 'viajes.id')->select('*')->get();
        $consulta['deducciones'] = \DB::table('deducciones')->join('viaje_deducciones', 'deducciones.id', '=', 'viaje_deducciones.deduccion_id')
            ->where('viajes.id', $viaje)->join('viajes', 'viaje_deducciones.viaje_id', '=', 'viajes.id')->select('*')->get();

        $consulta['conductor'] = Viaje::find($viaje)->conductor;
        return $consulta;
        
    }

    public function generarNumeroPlanilla($conductor_id){
        $central = Conductor::find($conductor_id)->first();
        $planilla = \DB::table('planilla')->where('numero_planilla',
            DB::raw("(select max(`numero_planilla`) from planilla)"))->where('central_id', $central->central_id)->get();
        if(!$planilla){
            return 'A001';
        } else {
            foreach($planilla as $c){
                return ++$c->numero_planilla;
            }
        }
    }

}
