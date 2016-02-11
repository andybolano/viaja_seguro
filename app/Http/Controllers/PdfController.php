<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PdfController extends Controller
{
    public function invoice()
    {
        $consulta = \DB::table('planilla')->where('numero_planilla',
        DB::raw("(select max(`numero_planilla`) from planilla)"))->where('central_id', 11)->get();
        foreach($consulta as $c){
         return JsonResponse::create(++$c->numero_planilla);
        }
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
