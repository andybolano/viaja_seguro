<?php

namespace App\Http\Controllers;

use App\Model\Central;
use App\Model\Pasajero;
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
//        $conductor_id = 5;
//        $cupos = \DB::table('pasajeros')->where('conductor_id', 5)->where('estado', 'En ruta')->count();
//
////        $consulta = Conductor::find(5)->pasajerosEnRuta;
////        $consulta['vehiculo'] = Conductor::find(5)->load('vehiculo')->select('vehiculo.cupos')->get();
//
//        return $cupos;
        list($total) = DB::table('vehiculos')->select(
            DB::raw('( (cupos) - (select count(conductor_id) from pasajeros where conductor_id =5 and estado = "En ruta") ) as total_profit'))
            ->where('conductor_id', 5)->get('total_profit');

        return $total->total_profit;
    }
}
