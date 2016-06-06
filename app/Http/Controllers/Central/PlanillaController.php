<?php

namespace App\Http\Controllers\Central;

use App\Model\Planilla;
use App\Model\PlanillaEspecial;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class PlanillaController extends Controller
{
    public function obtenerDatosPlanillaEspecial($central_id, $planilla_id)
    {
        $planilla = PlanillaEspecial::find($planilla_id);
        $planilla['tipo'] = 'especial';
        $planilla->load('viaje.conductor', 'central');
        return JsonResponse::create($planilla);
    }

    public function obtenerDatosPanillaNormal($central_id, $planilla_id)
    {
        $planilla = Planilla::find($planilla_id);
        $planilla['tipo'] = 'normal';
        $planilla->load('viaje.conductor', 'central.ciudad.departamento');
        return JsonResponse::create($planilla);
    }
}
