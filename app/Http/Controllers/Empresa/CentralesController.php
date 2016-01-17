<?php namespace App\Http\Controllers\Empresa;

use App\Model\Central;
use App\Model\Ciudad;
use App\Model\Empresa;
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
    public function index($empresa_id)
    {
        try{
            $centrales = Empresa::find($empresa_id)->centrales;
            $centrales->load('ciudad');
            return $centrales;
        }catch(\Exception $e){
            return response()->json(array("exception"=>$e->getMessage()), 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $empresa_id)
    {
        try{
            $data = $request->json()->all();
            $ciudad = Ciudad::find($data['ciudad']['id']);
            unset($data['ciudad']);
            $central = new Central($data);
            $central->ciudad()->associate($ciudad);
            Empresa::find($empresa_id)->centrales()->save($central);
            return response()->json($central, 201);
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
     * @param  int  $empresa_id, $central_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $empresa_id, $central_id)
    {
        try{
            if($central = Central::find($central_id)) {
                $data = $request->json()->all();
                $central->direccion = $data['direccion'];
                $central->telefono = $data['telefono'];
                $central->save();
                return response()->json(['mensaje' => 'registro actualizado'], 201);
            }else{
                return response()->json(['mensaje' => 'la central no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage(), ''=>$exc->getLine()), 400);
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $empresa_id, $central_id)
    {
        try{
            $central = Central::find($central_id);
            if($central){
                $central->delete();
                return response()->json(['mensaje' => 'registro eliminado'], 201);
            }else{
                return response()->json(['mensaje' => 'la central no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage(), ''=>$exc->getLine()), 400);
        }

    }
}
