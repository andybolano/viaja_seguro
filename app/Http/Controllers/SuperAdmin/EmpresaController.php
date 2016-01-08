<?php namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests;

class EmpresaController extends Controller
{

    private $empresas = [
        ['codigo'=> '1', 'nombre'=> 'Cootrasan', 'logo' => '', 'direccion'=> 'lejos', 'telefono'=> '9876896', 'servicios' => [], 'estado' => ['value'=> true, 'lavel'=>'Activa']],
        ['codigo'=> '2', 'nombre'=> 'Coomulcod', 'logo' => '', 'direccion'=> 'por ahi', 'telefono'=> '123456', 'estado' => ['value'=> true, 'lavel'=>'Activa'],
            'servicios' => [['codigo' => 1, 'concepto' => 'Manejor de reservas']]
        ],
        ['codigo'=> '3', 'nombre'=> 'TrnasValle', 'logo' => '', 'direccion'=> 'quien save', 'telefono'=> '495483', 'servicios' => [], 'estado' => ['value'=> false, 'lavel'=>'Inactiva']],
    ];
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->empresas;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function show($codigo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $codigo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function destroy($codigo)
    {
        //
    }
}
