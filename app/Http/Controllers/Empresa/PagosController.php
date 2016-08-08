<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Central;
use App\Model\Planilla;
use App\Model\Conductor;
use App\Model\Empresa;
use App\Model\PagoPrestacion;
use App\Model\PlanillaEspecial;
use App\Model\Prestacion;
use App\Model\Vehiculo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\Viaje;

class PagosController extends Controller
{
    private function verificartipoCentral($central_id)
    {
        return Central::find($central_id)->load('empresa');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getPlanillas($central_id)
    {
        $tipoEmpresa = $this->verificartipoCentral($central_id);
        if ($tipoEmpresa->empresa->tipo == '1') {
            return array(
                'planillas' => PlanillaEspecial::where('central_id', $central_id)
                    ->with('viaje.conductor')
                    ->get(),
                'tipo' => 'especial');
        } else {
            return array(
                'planillas' => Planilla::where('central_id', $central_id)
                    ->with('viaje.conductor')
                    ->get(),
                'tipo' => 'normal');
        }
    }

    public function getPlanilla($central_id, $planilla_id)
    {

        $tipoEmpresa = $this->verificartipoCentral($central_id);
        if ($tipoEmpresa->empresa->tipo == '1') {
            $planilla = PlanillaEspecial::find($planilla_id);
            $planilla['tipo'] = 'especial';
            $planilla->load('viaje.conductor', 'central');
            return JsonResponse::create($planilla);
        } else {
            $planilla = Planilla::find($planilla_id);
            $planilla['tipo'] = 'normal';
            $planilla->load('viaje.conductor', 'central.ciudad.departamento');
            return JsonResponse::create($planilla);
        }
    }

    public function getPrestaciones()
    {
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
                    'nombre' => $c->nombres . ' ' . $c->apellidos,
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
        if ($prestacion_id) {
            $pagosConductor = PagoPrestacion::where('conductor_id', $conductor_id)
                ->where('prestacion_id', $prestacion_id)->get();
        } else {
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
        if (!$conductor->pagosPrestaciones()->save($pago)) {
            return response()->json(['message' => 'no se pudo almacenar el registro'], 400);
        }
        return $pago;
    }
}
