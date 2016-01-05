<?php

namespace App\Http\Controllers\Empresa;

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
                foto => "http://materializecss.com/images/yuna.jpg",
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 2,
                foto=> "http://materializecss.com/images/yuna.jpg",
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 3,
                foto=> "http://materializecss.com/images/yuna.jpg",
                nombres => "Jose Miguel",
                apellidos => "Soto Acosta",
                direccion => "Cll tal cual",
                telefono => "3015941826",
                edad => "23 años"
            ],
            [
                id => 4,
                foto=> "http://materializecss.com/images/yuna.jpg",
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
        $data = $request->all();
        $conductor = new Conductor();
        $conductor->identificacion = $data["identificacion"];
        $conductor->nombres = $data["nombres"];
        $conductor->apellidos = $data["apellidos"];
        $conductor->direccion = $data["direccion"];
        $conductor->telefono = $data["telefono"];
        $conductor->correo = $data["correo"];
        $busqueda = Cliente::select("identificacion")
            ->where("identificacion",$data["identificacion"])
            ->first();
        if ($busqueda == null) {
            $conductor->save();
            return JsonResponse::create(array('message' => "Guardado Correctamente", "identificacion" => $conductor->identificacion), 200);
        }else{
            return JsonResponse::create(array('message' => "El conductor ya esta registrado", "identificacion" => $conductor->identificacion), 200);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Conductor::select('*')
            ->where("identificacion",$id)
            ->first();
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
