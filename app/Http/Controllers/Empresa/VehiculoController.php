<?php

namespace App\Http\Controllers\Empresa;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class VehiculoController extends Controller
{
    private $vehiculoEnTurno = 'UJSK-345';
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $vehiculos = [
          [
              'placa' => 'UJSK-123',
              'modelo' => 'KIA 2010',
              'color' => 'Amarillo',
              'conductor' => 'Jose miguel soto',
              'cupos' => '4'
          ],
            [
                'placa' => 'UJSK-345',
                'modelo' => 'KIA 2010',
                'color' => 'Amarillo',
                'conductor' => 'Jose miguel soto',
                'cupos' => '4'
            ],
            [
                'placa' => 'UJSK-156',
                'modelo' => 'KIA 2010',
                'color' => 'Amarillo',
                'conductor' => 'Jose miguel soto',
                'cupos' => '4'
            ],
        ];
        return $vehiculos;
    }

    public function getVehiculoEnTurno(){
        return $this->vehiculoEnTurno;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
