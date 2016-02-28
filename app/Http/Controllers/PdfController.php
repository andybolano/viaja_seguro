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
        $codigo_vial = '001';
    }
}
