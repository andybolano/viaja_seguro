<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Planilla;
use App\Model\Conductor;
use App\Model\Empresa;
use App\Model\PagoPrestacion;
use App\Model\Prestacion;
use App\Model\Vehiculo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\Viaje;

class PagosController extends Controller
{

    /**
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getPlanillas($central){
        $planilla = Planilla::where('central_id', $central)->get();
        $planilla->load('conductor');
        return $planilla;
    }

    public function getPlanilla($viaje){
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
        
        return JsonResponse::create($consulta);

    }

    public function getPrestaciones(){
        return Prestacion::all();
    }

    public function getPagosEmpresaPrestacion($empresa_id, $prestacion_id)
    {
        $conductores = Empresa::find($empresa_id)->conductores;
        $pagos = [];
        foreach ($conductores as $c) {
            $pagosConductor = $c->pagosPrestaciones($prestacion_id);
            foreach ($pagosConductor as $p) {
                $p->conductor = [
                    'nombre' => $c->nombres.' '.$c->apellidos,
                    'identificacion' => $c->identificacion
                ];
                $pagos[] = $p;
            }
        }
        return $pagos;
    }

    public function getPagosConductor($conductor_id, $prestacion_id = null)
    {
        $pagos = [];
        if($prestacion_id){
            $pagosConductor = PagoPrestacion::where('conductor_id', $conductor_id)
                ->where('prestacion_id', $prestacion_id)->get();
        }else{
            $pagosConductor = PagoPrestacion::where('conductor_id', $conductor_id)->get();
        }
        foreach ($pagosConductor as $p) {
            $pagos[] = $p;
        }
        return $pagos;
    }

    public function storePago(Request $request, $conductor_id)
    {
        $data = $request->json()->all();
        $conductor = Conductor::find($conductor_id);
        $pago = new PagoPrestacion([
            'prestacion_id' => $data['prestacion_id'],
            'fecha' => $data['fecha'] ? $data['fecha'] : date("Y-m-d"),
            'valor' => $data['valor'],
        ]);
        if(!$conductor->pagosPrestaciones()->save($pago)){
            return response()->json(['message' => 'no se pudo almacenar el registro'], 400);
        }
        return $pago;
    }
}
