<?php

namespace App\Http\Controllers\Empresa;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ClienteController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $clientes = [
            [
                'id' => '0',
                'idCliente' => '123',
                'foto' => 'http://materializecss.com/images/yuna.jpg',
                'nombres' => 'Jose Miguel',
                'apellidos' => 'Soto Acosta',
                'direccion' => 'Cll tal cual',
                'telefono' => '3015941826',
                'fechaNac' => '03/07/1992'
            ],
            [
                'id' => '1',
                'idCliente' => '123',
                'foto' => 'http://materializecss.com/images/yuna.jpg',
                'nombres' => 'Jose Miguel',
                'apellidos' => 'Soto Acosta',
                'direccion' => 'Cll tal cual',
                'telefono' => '3015941826',
                'fechaNac' => '03/07/1992'
            ],
        ];
        return $clientes;

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
