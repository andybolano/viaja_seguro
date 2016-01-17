<?php namespace App\Http\Controllers\SuperAdmin;

use App\Model\Ciudad;
use Illuminate\Routing\Controller;

class CiudadesController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Ciudad::all();
    }

}