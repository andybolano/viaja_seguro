<?php namespace App\Http\Controllers\Empresa;

use App\Model\Planilla;
use Illuminate\Http\Request;
use DB;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Mockery\CountValidator\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuditoriaController extends Controller
{
    public function getProducidosFecha($empresa_id, $central_id, Request $request){
        $data = $request->all();
        try{
            if(empty($data['fechaF'])){
                $producido = \DB::table('planilla')
                    ->join('viajes', 'planilla.viaje_id', '=', 'viajes.id')
                    ->join('centrales', 'planilla.central_id', '=', 'centrales.id')
                    ->select('planilla.total', 'planilla.numero_planilla', 'viajes.fecha', 'viajes.id')
                    ->where('centrales.id', $central_id)
                    ->where('viajes.fecha', $data['fechaI'])->get();
            }
            if(empty($data['fechaI'])){
                $producido = \DB::table('planilla')
                    ->join('viajes', 'planilla.viaje_id', '=', 'viajes.id')
                    ->join('centrales', 'planilla.central_id', '=', 'centrales.id')
                    ->select('planilla.total', 'planilla.numero_planilla', 'viajes.fecha', 'viajes.id')
                    ->where('centrales.id', $central_id)
                    ->where('viajes.fecha', $data['fechaF'])->get();
            }
            if($data['fechaI'] && $data['fechaF']){
                $producido = \DB::table('planilla')
                    ->join('viajes', 'planilla.viaje_id', '=', 'viajes.id')
                    ->join('centrales', 'planilla.central_id', '=', 'centrales.id')
                    ->select('planilla.total', 'planilla.numero_planilla', 'viajes.fecha', 'viajes.id')
                    ->where('centrales.id', $central_id)
                    ->whereBetween('viajes.fecha', array($data['fechaI'], $data['fechaF']))->get();
            }

        }catch(Exception $e){

        }
        return JsonResponse::create($producido);
    }

    public function getProducidoVehiculo($codigo_vial){

    }
}
