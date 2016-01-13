<?php namespace App\Http\Controllers\Empresa;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CentralesController extends Controller
{
    private $centrales = [
        ['id' => 1, 'ciudad' => 'Valledupar', 'direccion' => 'av siempre viva', 'telefono' => '3456789'],
        ['id' => 2, 'ciudad' => 'La Jagua', 'direccion' => 'una calle', 'telefono' => '8765432'],
        ['id' => 3, 'ciudad' => 'Fonseca', 'direccion' => 'ahi', 'telefono' => '1123456']
    ];
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->centrales;
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
            $data['id'] = 4;
            //guardar modelo
            return response()->json($data, 201);
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
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
