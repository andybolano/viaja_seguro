<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Conductor;
use App\Model\Empresa;
use App\Model\PagoPrestacion;
use App\Model\Prestacion;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PagosController extends Controller
{

    /**
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
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
            'fecha' => $data['fecha'],
            'valor' => $data['valor'],
        ]);
        if(!$conductor->pagosPrestaciones()->save($pago)){
            return response()->json(['message' => 'no se pudo almacenar el registro'], 400);
        }
        return $pago;
    }
}
