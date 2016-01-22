<?php namespace App\Http\Controllers\Empresa;

use App\Model\Central;
use App\Model\Ciudad;
use App\Model\Empresa;
use App\Model\Rol;
use App\Model\Ruta;
use App\Model\Usuario;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class RutasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($empresa_id)
    {
        $centrales = Empresa::find($empresa_id)->centrales;
        $rutas = [];
        foreach ($centrales as $central) {
            foreach ($central->rutas as $ruta) {
                $rutas[] = [
                    'id' => $ruta->id,
                    'origen' => $ruta->origen->load('ciudad'),
                    'destino' => $ruta->destino->load('ciudad')
                ];
            }
        }
        return $rutas;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $empresa_id)
    {
        $data = $request->json()->all();
        $ruta = new Ruta();
        $ruta->id_central_origen = $data['origen']['id'];
        $ruta->id_central_destino = $data['destino']['id'];
        if($ruta->save()){
            return response()->json($ruta, 201);
        }else {
            return response()->json('A ocurrido un error inesperado', 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $empresa_id, $ruta_id)
    {
        $ruta = Ruta::find($ruta_id);
        if($ruta){
            $ruta->delete();
            return response()->json(['mensaje' => 'registro eliminado'], 201);
        }else{
            return response()->json(['mensaje' => 'la central no existe'], 400);
        }
    }

    public function getRol()
    {
        return Rol::where('nombre', 'CENTRAL_EMPRESA')->first();
    }
}
