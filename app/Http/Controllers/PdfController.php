<?php

namespace App\Http\Controllers;

use App\Model\Planilla;
use App\Model\Viaje;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PdfController extends Controller
{
    public function invoice()
    {
//        $data = $this->getData();
//        $date = date('Y-m-d');
//        $invoice = "2222";
//        $view =  \View::make('pdf.invoice', compact('data', 'date', 'invoice'))->render();
//        $pdf = \App::make('dompdf.wrapper');
////        $pdf->loadHTML($view);
////        return $pdf->stream('invoice');
//
//        $pdf = \PDF::loadView('pdf.invoice', $data);
//        return $pdf->stream('invoice.pdf');
//        return Planilla::whereRaw('id = (select max(`id`) from planilla)')->get();


        $consulta = Planilla::select('*')->where('viaje_id', 17)->first()->load('viaje');
        $consulta['giros'] = \DB::table('giros')->join('viaje_giros', 'giros.id', '=', 'viaje_giros.giro_id')
            ->join('viajes', 'viaje_giros.viaje_id', '=', 'viajes.id')
            ->where('viajes.id', 17)->select('*')->get();
        $consulta['pasajeros'] = \DB::table('pasajeros')->join('viaje_pasajeros', 'pasajeros.id', '=', 'viaje_pasajeros.pasajero_id')
            ->where('viajes.id', 17)->join('viajes', 'viaje_pasajeros.viaje_id', '=', 'viajes.id')->select('*')->get();
        $consulta['paquetes'] = \DB::table('paquetes')->join('viaje_paquetes', 'paquetes.id', '=', 'viaje_paquetes.paquete_id')
            ->where('viajes.id', 17)->join('viajes', 'viaje_paquetes.viaje_id', '=', 'viajes.id')->select('*')->get();
        $consulta['conductor'] = Viaje::find(17)->conductor;
        return JsonResponse::create($consulta);

    }


    public function getData()
    {
        $data =  [
            'quantity'      => '1' ,
            'description'   => 'some ramdom text',
            'price'   => '500',
            'total'     => '500'
        ];
        return $data;
    }
}
