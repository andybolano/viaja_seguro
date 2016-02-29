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
         \DB::update('UPDATE ubicacion_conductor, turnos
SET ubicacion_conductor.ruta_id = turnos.ruta_id
WHERE ubicacion_conductor.conductor_id = turnos.conductor_id;');


    }
}
