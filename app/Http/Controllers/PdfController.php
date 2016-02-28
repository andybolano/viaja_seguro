<?php

namespace App\Http\Controllers;

use App\Model\Central;
use DB;
use App\Model\Conductor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Psy\Util\Json;

class PdfController extends Controller
{
    public function invoice()
    {
//        $con = Conductor::join('vehiculos', 'conductores.id', '=', 'vehiculos.conductor_id')
//            ->select('conductores.id', 'conductores.nombres', 'conductores.imagen', 'conductores.apellidos',
//                'conductores.telefono', 'conductores.activo', 'conductores.central_id', 'conductores.identificacion'
//            )
//            ->whereNotExists(function($query){
//                $query->select(\DB::raw(1))
//                    ->from('turnos')
//                    ->whereRaw('turnos.conductor_id = conductores.id');
//            })->get()->load('viaje');
//

        $con = \DB::table('conductores')
            ->join('vehiculos', 'conductores.id', '=', 'vehiculos.conductor_id')
            ->join('viajes', 'conductores.id', '=', 'viajes.conductor_id')
            ->select('conductores.id', 'conductores.nombres', 'conductores.imagen', 'conductores.apellidos',
                'conductores.telefono', 'conductores.activo', 'conductores.central_id', 'conductores.identificacion'
                )
            ->whereNotExists(function($query){
                $query->select(\DB::raw(1))
                    ->from('turnos')
                    ->whereRaw('turnos.conductor_id = conductores.id');
            })->get();
        return JsonResponse::create($con);
    }
}
