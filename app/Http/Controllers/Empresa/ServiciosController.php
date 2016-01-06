<?php

namespace App\Http\Controllers\Empresa;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ServiciosController extends Controller
{
    public function getPasajeros(){
        return [
            [
                'id' => '0',
                'idPasajero' => '123',
                'nombres' => 'Uno que viaja',
                'apellidos' => 'Los apellidos',
                'origen' => 'Valledupar cualquier direccion',
                'destino' => 'A quien le importa',
                'vehiculo' => 'UJSK-345',
                'telefono' => '3015941826',
            ]
        ];
    }

    public function getGiros(){
        return [
            [
                'id' => '0',
                'idRemitente' => '123',
                'remitente' => 'El que lo remite',
                'telRemitente' => '3015941826',
                'idReceptor' => '321',
                'receptor' => 'El que lo recive',
                'telReceptor' => '3007073524',
                'origen' => 'Valledupar cualquier direccion',
                'destino' => 'A quien le importa',
                'vehiculo' => 'UJSK-345',
                'cantidadGiro' => '400000'
            ]
        ];
    }

    public function getPaquetes(){
        return [
            [
                'id' => '0',
                'idRemitente' => '123',
                'remitente' => 'El que lo remite',
                'telRemitente' => '3015941826',
                'idReceptor' => '321',
                'receptor' => 'El que lo recive',
                'telReceptor' => '3007073524',
                'origen' => 'Valledupar cualquier direccion',
                'destino' => 'A quien le importa',
                'vehiculo' => 'UJSK-345',
                'descripcionPaquete' => '10 kilos de marihuana'
            ]
        ];
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

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
