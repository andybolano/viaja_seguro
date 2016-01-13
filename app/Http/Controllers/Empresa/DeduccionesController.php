<?php

namespace App\Http\Controllers\Empresa;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class DeduccionesController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $deducciones = [
            [
                'id' => '0',
                'nombre' => 'INGRESO ADMINISTRATIVO',
                'descripcion' => 'NINGUNA',
                'valor' => '8000',
                'activo' => 'true'
            ],
            [
                'id' => '1',
                'nombre' => 'SEGUROS',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'true'
            ],
            [
                'id' => '2',
                'nombre' => 'FONDO DE REPOSICION',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'false'
            ],
            [
                'id' => '3',
                'nombre' => 'APORTE SOCIAL',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'false'
            ],
            [
                'id' => '4',
                'nombre' => 'SOSTENIMIENTO',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'true'
            ],
            [
                'id' => '5',
                'nombre' => 'AHORRO VOLUNTARIO',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'true'
            ],
            [
                'id' => '6',
                'nombre' => 'AHORRO ASOCIADO',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'false'
            ],
            [
                'id' => '7',
                'nombre' => 'AHORRO ESPECIAL',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'false'
            ],
            [
                'id' => '8',
                'nombre' => 'DESCUENTO ESPECIAL',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'false'
            ]
            ,
            [
                'id' => '9',
                'nombre' => 'OTROS',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'true'
            ],
            [
                'id' => '10',
                'nombre' => 'TELEFONO',
                'descripcion' => 'NINGUNA',
                'valor' => '',
                'activo' => 'true'
            ]
        ];
        return $deducciones;

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

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

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
