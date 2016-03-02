<?php namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\NotificacionController;
use App\Model\Actividad;
use App\Model\Conductor;
use App\Model\Empresa;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ActividadesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($empresa_id)
    {
        try{
            $actividades = Empresa::find($empresa_id)->agendaActividades;
            foreach ($actividades as $actividad) {
                if(strtotime($actividad->fecha)<time()){
                    $actividad->estado = 'Finalizada';
                    $actividad->save();
                }
            }
            return $actividades;
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
        $noty = new NotificacionController();
        $conductores = \DB::table('usuarios')->select('reg_id')->where('rol_id', 4)->get();
        $i =0;
        $reg_ids = [];
        foreach($conductores as $reg_id){
            $reg_ids[$i] = $reg_id->reg_id;
            $i++;
        }
        $mensaje = 'La empresa ha agendado una nueva actividad';
//        try{
            $data = $request->json()->all();
            $noty->enviarNotificacion($mensaje,$reg_ids,'Acividad');
            $actividad = new Actividad($data);
            if(!Empresa::find($empresa_id)->agendaActividades()->save($actividad)){
                return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
            }
            return response()->json(['mensaje' => 'se guardo correctamente el registro'], 201);
//        } catch (\Exception $exc) {
//            return response()->json(array("exception"=>$exc->getMessage()), 400);
//        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $codigo
     * @return \Illuminate\Http\Response
     */
    public function show($empresa_id, $id)
    {
        return Actividad::find($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            if($actividad = Actividad::find($id)) {
                $data = $request->json()->all();
                $actividad->fecha = $data['fecha'];
                $actividad->nombre = $data['nombre'];
                $actividad->descripcion = $data['descripcion'];
                $actividad->estado = $data['estado'];
                $actividad->save();
                return response()->json(['mensaje' => 'registro actualizado'], 201);
            }else{
                return response()->json(['mensaje' => 'la actividad no existe'], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage(), ''=>$exc->getLine()), 400);
        }

    }

}
