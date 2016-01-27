<?php

namespace App\Http\Controllers\Cliente;

use App\Model\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
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
        return Cliente::all();
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
        try{
            $data = $request->json()->all();

            //USUARIO
            $usuario = Usuario::nuevo($data['identificacion'], $data['identificacion'], $this->getRol()->id);
            $data['usuario_id'] = $usuario->id;

            $cliente = new Cliente($data);
            if(!$cliente){
                return response()->json(['mensajeError' => 'no se ha podido almacenar el usuario'], 400);
                $usuario->delete();
            }
            return response()->json($cliente, 201);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
    }

    public function storeImagen(Request $request, $cliente_id){
        try{
            $cliente = Cliente::find($cliente_id);

            if ($request->hasFile('imagen')) {
                $request->file('imagen')->move('images/clientes/', "conductor$cliente_id.png");
                $nombrefile = $_SERVER['PHP_SELF'].'/../images/clientes/'."conductor$cliente_id.png";
                $cliente->imagen = $nombrefile;
                $cliente->save();
                return response()->json(['nombrefile'=>$nombrefile], 201);
            }else {
                return response()->json([], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
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
        return Cliente::find($id);
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

        try{
            if($cliente = Cliente::find($id)) {

                $data = $request->json()->all();
                $cliente->identificacion = $data['identificaicon'];
                $cliente->nombres = $data['nombres'];
                $cliente->apellidos = $data['apellidos'];
                $cliente->telefono = $data['telefono'];
                $cliente->direccion = $data['direccion'];
                $cliente->fechaNac = $data['fechaNac'];

                $cliente->save();
                return response()->json(['mensaje' => 'Registro actualizado'], 201);
            }else{
                return response()->json(['mensaje' => 'El cliente no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage(), ''=>$exc->getLine()), 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

    }
}
