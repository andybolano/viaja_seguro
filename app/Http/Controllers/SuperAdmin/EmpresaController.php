<?php namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Model\Empresa;
use App\Model\Rol;
use App\Model\Usuario;
use Illuminate\Http\Request;
use App\Http\Requests;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $empresas = Empresa::with('servicios')->get();
        return $empresas;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
//        try{
            $data = $request->json()->all();
            $empresa_servicios = $data['servicios'];
            unset($data['servicios']);
            $data_usuario = $data['usuario'];
            unset($data['usuario']);
            $usuario = Usuario::nuevo($data_usuario['nombre'], $data_usuario['contrasena'], $this->getRol()->id);
            $data['usuario_id'] = $usuario->id;
            $empresa = new Empresa($data);
            if($empresa->save()) {
                foreach ($empresa_servicios as $servicio) {
                    $empresa->servicios()->attach($servicio['id']);
                }
                return response()->json($empresa, 201);
            }else{
                return response()->json(['mensajeError' => 'no se ha podido almacenar el usuario'], 400);
                $usuario->delete();
            }
//        } catch (\Exception $exc) {
//            return response()->json(array("exception"=>$exc->getMessage()), 400);
//        }
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return mixed
     */
    public function saveLogo(Request $request, $id)
    {
        try{
            if ($request->hasFile('logo')) {
                $request->file('logo')->move('images/empresas/', "empresa$id.png");
                $nombrefile = $_SERVER['PHP_SELF'].'/../images/empresas/'."empresa$id.png";
                $empresa = $this->show($id);
                $empresa->logo = $nombrefile;
                $empresa->save();
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
        $empresa = Empresa::find($id);
        $empresa->load('servicios');
        return $empresa;
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
            $data = $request->json()->all();
            $empresa_servicios = isset($data['servicios']) ? $data['servicios'] : false;
            unset($data['servicios']);
            $empresa = $this->show($id);
            if($empresa){
                //actualizo los compos de la empresa
                foreach($data as $campo=>$valor){
                    $empresa->$campo = $valor;
                }
                $empresa->save();
                if($empresa_servicios){
                    $servicios = [];
                    foreach($empresa_servicios as $servicio){
                        $servicios[] = $servicio['id'];
                    }
                    $empresa->servicios()->sync($servicios);
                }
                return response()->json(['mensaje' => 'registro actualizado'], 201);
            }else{
                return response()->json(['mensaje' => 'la empresa no existe'], 400);
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
        $empresa = $this->show($id);
        if($empresa){
            $empresa->servicios()->detach();
            $usuario = $empresa->usuario;
            $empresa->delete();
            $usuario->delete();
            return response()->json(['mensaje' => 'registro eliminado'], 201);
        }else{
            return response()->json(['mensaje' => 'la empresa no existe'], 400);
        }
    }

    public function getRol()
    {
        return Rol::where('nombre', 'EMPRESA')->first();
    }
}
