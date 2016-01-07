<?php namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests;

class EmpresaController extends Controller
{

    private $empresas = [
        ['id'=> '1', 'nombre'=> 'Cootrasan', 'direccion'=> 'lejos', 'telefono'=> '9876896', 'servicios' => [], 'estado' => ['value'=> true, 'lavel'=>'Activa']],
        ['id'=> '2', 'nombre'=> 'Coomulcod', 'direccion'=> 'por ahi', 'telefono'=> '123456', 'estado' => ['value'=> true, 'lavel'=>'Activa'],
            'servicios' => [['id' => 1, 'concepto' => 'Manejor de reservas']]
        ],
        ['id'=> '3', 'nombre'=> 'TrnasValle', 'direccion'=> 'quien save', 'telefono'=> '495483', 'servicios' => [], 'estado' => ['value'=> false, 'lavel'=>'Inactiva']],
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
