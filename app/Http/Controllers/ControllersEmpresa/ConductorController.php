<?php

namespace App\Http\Controllers\EmpresaControllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ConductorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $conductores = [
            [
                id => 0,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 1,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 2,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 3,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 4,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ]
        ];
        return $conductores;

    }

    public function getAll(){
        $conductores = [
            [
                id => 0,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 1,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 2,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 3,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 4,
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ]
        ];
        return $conductores;
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
