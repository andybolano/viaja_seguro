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
//        $datos = array();
        $con = \DB::table('conductores')
            ->join('vehiculos', 'conductores.id', '=', 'vehiculos.conductor_id')
            ->select('conductores.id', 'conductores.nombres', 'conductores.imagen', 'conductores.apellidos',
                'conductores.telefono')
            ->whereNotExists(function($query){
                $query->select(\DB::raw(1))
                    ->from('turnos')
                    ->whereRaw('turnos.conductor_id = conductores.id')
                    ->where('vehiculos.conductor_id','conductores.id');
            })->get();
        return JsonResponse::create($con);
    }
}
