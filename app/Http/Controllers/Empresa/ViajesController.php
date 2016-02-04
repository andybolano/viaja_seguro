<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Pasajero;
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
                $this->crearViaje($data['conductor_id'], $data['ruta_id']);
                return JsonResponse::create(array('message' => 'Despachado correctamente'));
            }
        }
    }

    public function crearViaje(&$conductor_id, &$ruta_id){
        $data = [
            'conductor_id' => $conductor_id,
            'ruta_id' => $ruta_id,
            'fecha' => date('Y-M-d')
        ];

        $pasajeros = Pasajero::select('id')->where('conductor_id', $conductor_id)->where('estado', '=', 'En ruta')->get();
        $giros = Giro::select('id')->where('conductor_id', $conductor_id)->where('estado', '=', 'En ruta')->get();
        $paquetes = Paquete::select('id')->where('conductor_id', $conductor_id)->where('estado', '=', 'En ruta')->get();

        $viaje = new Viaje($data);
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
            return response()->json(['message' => 'Viaje creado corretamente', $viaje], 200);
        }else{
            return response()->json(['message' => 'No se pudo crear el viaje'], 400);
        }



    }
}
