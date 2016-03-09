<?php

namespace App\Http\Controllers\Empresa;

use App\Model\Central;
use App\Model\Cliente;
use App\Model\Conductor;
use App\Model\Documento;
use App\Model\Vehiculo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Mockery\CountValidator\Exception;

class VehiculoController extends Controller
{
    private $vehiculoEnTurno = 'UJSK-345';

    public function getVehiculoEnTurno(){
        return $this->vehiculoEnTurno;
    }

    public function getDocumentacion(){
        $documentacion = Documento::all();
        return $documentacion;
    }

    public function guardaImagen(Request $request, $id)
    {
        try{
            $vehiculo = Vehiculo::find($id);

            if ($request->hasFile('imagenv')) {
                $request->file('imagenv')->move('images/vehiculos/', "vehiculo$id.png");
                $nombrefile = $_SERVER['SERVER_NAME'].'/public/images/vehiculos/'."vehiculo$id.png";
                $vehiculo->imagen = $nombrefile;
                $vehiculo->save();
                return response()->json(['nombrefile'=>$nombrefile], 201);
            }else {
                return response()->json([], 400);
            }
        } catch (\Exception $exc) {
            return response()->json(array("exception"=>$exc->getMessage()), 400);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $data = $request->all();
        $vehiculo_conductor = Conductor::find($data['conductor_id'])->first();

        if(!$vehiculo_conductor->load('vehiculo')){
            $busqueda = Vehiculo::select("placa")
                ->where("placa",$data["placa"])
                ->first();
            if ($busqueda == null) {
                if(!$vehiculo_conductor->vehiculo()->save(new Vehiculo($data))){
                    return response()->json(['message' => 'no se ha podido almacenar el vehiculo del conductor'], 400);
                }else{
                    return response()->json(['message' => 'Guardado'], 400);
                }

            }else{
                return response()->json(array('message' => "La placa del vehiculo ya se encuentra registrada."), 200);
            }
        }else{
            $vehiculo = Vehiculo::select("*")
                ->where("placa",$data["placa"])
                ->first();
            $vehiculo->modelo = $data['modelo'];
            $vehiculo->cupos = $data['cupos'];
            $vehiculo->color = $data['color'];
            $vehiculo->save($data);
            return JsonResponse::create(array('message' => "Vehiculo actualizado correctametne."), 200);
        }
    }

    public function updateDocumentacion(Request $request, $vehiculo_id){
        $data = $request->all();
        $vehiculo = Vehiculo::find($vehiculo_id)->first();
        $vehiculo->soat = $data['soat'];
        $vehiculo->fecha_soar = $data['fecha_soat'];
        $vehiculo->tecnomecanica = $data['tecnomecanica'];
        $vehiculo->fecha_tecnomecanica = $data['fecha_tecnomecanica'];
        $vehiculo->tarjeta_propiedad = $data['tarjeta_propiedad'];
        $vehiculo->save();
    }
}
