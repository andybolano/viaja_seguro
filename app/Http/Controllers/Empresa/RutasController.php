<?php namespace App\Http\Controllers\Empresa;

use App\Http\Controllers\NotificacionController;
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
    public function destroy($ruta_id)
    {
        $ruta = Ruta::find($ruta_id);
        if($ruta){
            $ruta->delete();
            return response()->json(['mensaje' => 'registro eliminado'], 201);
        }else{
            return response()->json(['mensaje' => 'la central no existe'], 400);
        }
    }

    public function getConductoresEnTurno($ruta_id)
    {
        return Ruta::find($ruta_id)->turnos;
    }

    public function updateConductoresEnTurno(Request $request, $ruta_id)
    {
        $noty = new NotificacionController();
        $data = $request->json()->all();
        $turnos_actuales = [];
        $ruta = Ruta::find($ruta_id);
        foreach($data['turnos'] as $turno){
            $turnos_actuales[$turno['conductor_id']] = ['turno' => $turno['turno']];
        }
        if($ruta->toUpdateTurnos()->sync($turnos_actuales)){
            $ruta = $ruta->destino->ciudad;
            foreach($data['turnos'] as $turno){
                if($turno['accion'] == 'agregar'){
                    $mensaje = "Has sido agregado a la ruta hacia $ruta->nombre en el turno ".$turno['turno'];
                    $noty->enviarNotificacionConductores($mensaje, $turno['conductor_id'],'Actualizacion turno', $ruta_id);
                }else if($turno['accion'] == 'quitar'){
                    $mensaje = "Has sido removido de los turnos de la ruta hacia $ruta->nombre";
                    $noty->enviarNotificacionConductores($mensaje, $turno['conductor_id'],'Actualizacion turno', $ruta_id);
                }else{
                    $mensaje = "Estas en el turno ".$turno['turno']." en la ruta hacia $ruta->nombre";
                    $noty->enviarNotificacionConductores($mensaje, $turno['conductor_id'],'Actualizacion turno', $ruta_id);
                }
            }
            return response()->json(['mensaje' => 'turnos modifcados'], 201);
        }else{
            return response()->json(['mensajError' => 'error al actualizar lso turnos'], 400);
        }
    }
}
