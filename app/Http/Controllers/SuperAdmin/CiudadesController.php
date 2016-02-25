<?php namespace App\Http\Controllers\SuperAdmin;

use App\Model\Ciudad;
use App\Model\Departamento;
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

    public function getDepartamentos()
    {
        return Departamento::all();
    }

    public function getMunicipios($departamento_id)
    {
        return Departamento::find($departamento_id)->municipios;
    }
}
