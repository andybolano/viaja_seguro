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
            $vehiculo = Vehiculo::select('*')
                ->where('placa', $id)->first();

            if ($request->hasFile('imagenv')) {
                $request->file('imagenv')->move('images/vehiculos/', "vehiculo$id.png");
                $nombrefile = $_SERVER['PHP_SELF'].'/../images/vehiculos/'."vehiculo$id.png";
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
    public function update(Request $request, $id)
    {
        $data = $request->all();
        $vehiculo = Vehiculo::find($id);
        $vehiculo->cupos = $data['cupos'];

//        $vehiculo->placa = $data["placa"];
//        $vehiculo->modelo = $data["modelo"];
//        $vehiculo->color = $data["color"];
//        $vehiculo->codigo_vial = $data["codigo_vial"];
//        $vehiculo->cupos = $data["cupos"];
//        $vehiculo->identificacion_propietario = $data["identificacion_propietario"];
//        $vehiculo->nombre_propietario = $data["nombre_propietario"];
//        $vehiculo->tel_propietario = $data["tel_propietario"];

        $vehiculo->save($data);
        return JsonResponse::create(array('message' => "Vehiculo actualizado correctametne."), 200);
    }
}
