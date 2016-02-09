<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Paquete;
use App\Model\Giro;
use App\Model\Pasajero;
use App\Model\Planilla;
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
        if($t = DB::table('vehiculos')
            ->join('turnos', 'vehiculos.conductor_id', '=', 'turnos.conductor_id')
            ->select('vehiculos.cupos')->where('vehiculos.cupos', '>', '0')
            ->where('turnos.conductor_id', $data['conductor_id'])->first()
        ){
            return JsonResponse::create(array('message' => 'El conductor que desea despachar aun se encuentra con cupos disponibles'));
        }else{
            if(!DB::table('turnos')->where('ruta_id', $data['ruta_id'])->where('turno', $data['turno'] )->delete()){
                return JsonResponse::create(array('message' => 'Error al eliminar'));
            }else{

                return JsonResponse::create(array('message' => 'Despachado correctamente', 'viaje' => $this->crearViaje($data['conductor_id'], $data['ruta_id'])));
            }
        }
    }

    public function crearViaje($conductor_id, $ruta_id){
        $viaje = new Viaje();

        $viaje->conductor_id = $conductor_id;
        $viaje->ruta_id = $ruta_id;
        $viaje->fecha = date("Y-m-d");

        $pasajeros = Pasajero::select('id')->where('conductor_id', $conductor_id)->where('estado', '=', 'En ruta')->get();
        $giros = Giro::select('id')->where('conductor_id', $conductor_id)->where('estado', '=', 'En ruta')->get();
        $paquetes = Paquete::select('id')->where('conductor_id', $conductor_id)->where('estado', '=', 'En ruta')->get();

        if($viaje->save()){
            foreach ($pasajeros as $pasajero) {
                $viaje->pasajeros()->attach($pasajero['id']);
            }

            foreach ($giros as $giro) {
                $viaje->giros()->attach($giro['id']);
            }

            foreach ($paquetes as $paquete) {
                $viaje->paquetes()->attach($paquete['id']);
            }

            $this->crearPlanilla($viaje->id);
            $planilla = $this->generarDatosPlanilla($viaje->id);

            return array('viaje' => $viaje, 'planilla' => $planilla);
        }else{
            return 'No se pudo crear el viaje';
        }
    }

    public function crearPlanilla($viaje_id){
        $planilla = new Planilla();
        $planilla->viaje_id = $viaje_id;
        if($planilla->save()){
            return JsonResponse::create('Se creo la planilla correctamente');
        }else{
            return JsonResponse::create('Error al crear la planilla');
        }
    }

    public function generarDatosPlanilla($viaje){
        $consulta = Planilla::select('*')->where('viaje_id', $viaje)->first()->load('viaje');
        $consulta['giros'] = \DB::table('giros')->join('viaje_giros', 'giros.id', '=', 'viaje_giros.giro_id')
            ->join('viajes', 'viaje_giros.viaje_id', '=', 'viajes.id')
            ->where('viajes.id', $viaje)->select('*')->get();
        $consulta['pasajeros'] = \DB::table('pasajeros')->join('viaje_pasajeros', 'pasajeros.id', '=', 'viaje_pasajeros.pasajero_id')
            ->where('viajes.id', $viaje)->join('viajes', 'viaje_pasajeros.viaje_id', '=', 'viajes.id')->select('*')->get();
        $consulta['paquetes'] = \DB::table('paquetes')->join('viaje_paquetes', 'paquetes.id', '=', 'viaje_paquetes.paquete_id')
            ->where('viajes.id', $viaje)->join('viajes', 'viaje_paquetes.viaje_id', '=', 'viajes.id')->select('*')->get();

        $consulta['conductor'] = Viaje::find($viaje)->conductor;
        return $consulta;
    }

    public function generarNumeroPlanilla(){

    }
}