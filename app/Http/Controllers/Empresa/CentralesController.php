<?php namespace App\Http\Controllers\Empresa;

use App\Model\Central;
use App\Model\Ciudad;
use App\Model\Empresa;
use App\Model\Rol;
use App\Model\Usuario;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CentralesController extends Controller
{
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
            $centrales->load('usuario');
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
            $data_usuario = $data['usuario'];
            unset($data['usuario']);
            $usuario = Usuario::nuevo($data_usuario['nombre'], $data_usuario['contrasena'], $this->getRol()->id);
            $data['usuario_id'] = $usuario->id;
            $central = new Central($data);
            $central->ciudad()->associate($ciudad);
            if(!Empresa::find($empresa_id)->centrales()->save($central)){
                return response()->json(['mensajeError' => 'no se ha podido almacenar el usuario'], 400);
                $usuario->delete();
            }
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
     * @param  int $central_id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $central_id)
    {
        try{
            if($central = Central::find($central_id)) {
                $data = $request->json()->all();
                $central->miDireccionLa = $data['miDireccionLa'];
                $central->miDireccionLo = $data['miDireccionLo'];
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
     * @param  int  $central_id
     * @return \Illuminate\Http\Response
     */
    public function destroy($central_id)
    {
        try{
            $central = Central::find($central_id);
            if($central){
                $usuario = $central->usuario;
                $central->delete();
                $usuario->delete();
                return response()->json(['mensaje' => 'registro eliminado'], 201);
            }else{
                return response()->json(['mensaje' => 'la central no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage(), ''=>$exc->getLine()), 400);
        }

    }

    public function getConductores($id)
    {
        $conductores = Central::find($id)->conductores;
        return $conductores;
    }

    public function getVehiculos($id)
    {
        $vehiculos = Central::find($id)->vehiculos;
        return $vehiculos;
    }

    private function getRol()
    {
        return Rol::where('nombre', 'CENTRAL_EMPRESA')->first();
    }
}
