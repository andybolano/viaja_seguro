<?php

namespace App\Http\Controllers;

use App\Model\Planilla;
use Illuminate\Http\Request;

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
        return Planilla::select('*')->where('viaje_id', 7)->first()->load('viaje');

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
