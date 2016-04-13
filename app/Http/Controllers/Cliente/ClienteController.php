<?php

namespace App\Http\Controllers\Cliente;

use App\Model\Cliente;
use App\Model\DataSolicitudGiroPaquete;
use App\Model\DataSolicitudPasajero;
use App\Model\Rol;
use App\Model\Solicitud;
use App\Model\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ClienteController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->json()->all();

        if(Usuario::where('email', $data['correo'])->first()) {
            return response()->json(['mensajeError' => 'ya existe un usuario con este correo electronico'], 409);
        } else {
            $usuario = Usuario::nuevo($data['correo'], $data['contrasena'], $this->getRol()->id);
            $data['usuario_id'] = $usuario->id;
            unset($data['contrasena']);

            $cliente = new Cliente($data);
            if(!$cliente->save()) {
                return response()->json(['menssage' => 'No se ha podido almacenar el usuario'], 400);
                $usuario->delete();
            }
            return response()->json($cliente, 201);
        }
    }

    public function getRol()
    {
        return Rol::where('nombre', 'CLIENTE')->first();
    }

    public function storeImagen(Request $request, $cliente_id)
    {
        try {
            $cliente = Cliente::find($cliente_id);

            if($request->hasFile('imagen')) {
                $request->file('imagen')->move('images/clientes/', "cliete$cliente_id.png");
                $nombrefile = $_SERVER['SERVER_NAME'] . '/public/images/clientes/' . "cliente$cliente_id.png";
                $cliente->imagen = $nombrefile;
                $cliente->save();
                return response()->json(['nombrefile' => $nombrefile], 201);
            } else {
                return response()->json([], 400);
            }
        } catch(\Exception $exc) {
            return response()->json(["exception" => $exc->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $cliente = Cliente::find($id);

        if(!$cliente) {
            $cliente = Cliente::where('identificacion', $id)->first();
            if(!$cliente) {
                return JsonResponse::create(["message" => 'No se encontro el cliente puede registrarlo si continua'], 400);
            }
        }
        return $cliente;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int                      $id
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        try {
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
            } else {
                return response()->json(['mensaje' => 'El cliente no existe'], 400);
            }
        } catch(\Exception $exc) {
            return response()->json(["exception" => $exc->getMessage(), '' => $exc->getLine()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

    }

    public function newSolicitud(Request $request, $cliente_id)
    {
        $data = $request->json()->all();
        $cliente = Cliente::find($cliente_id);
        if($data['tipo'] == 'vehiculo') {
            $pasajeros = $data['pasajeros'];
            unset($data['pasajeros']);
            $solicitud = $cliente->solicitudes()->save(new Solicitud($data));
            if($solicitud) {
                foreach($pasajeros as $pasajero) {
                    $solicitud->datos_pasajeros()->save(new DataSolicitudPasajero($pasajero));
                }
                \App::make('\App\Events\NuevaSolicitudEvent')->enviarNotificacion($data['tipo'], 'Existe una nueva solicitud, verificala en la seccion de despacho', $data['central_id']);
                return response()->json($solicitud->id, 200);
            } else {
                return response()->json(['menssage' => 'No se ha podido almacenar la solicitud'], 400);
            }
        } elseif($data['tipo'] == 'giro' || $data['tipo'] == 'paquete'){
            $detalles = $data['detalles'];
            unset($data['detalles']);
            $solicitud = $cliente->solicitudes()->save(new Solicitud($data));
            if($solicitud) {
                $solicitud->detalles()->save(new DataSolicitudGiroPaquete($detalles));
                \App::make('\App\Events\NuevaSolicitudEvent')->enviarNotificacion($data['tipo'], 'Existe una nueva solicitud, verificala en la seccion de despacho', $data['central_id']);
                return response()->json($solicitud->id, 200);
            } else {
                return response()->json(['menssage' => 'No se ha podido almacenar la solicitud'], 400);
            }
        }

    }

    public function updateSolicitud(Request $request, $cliente_id, $id)
    {
        if($solicitud = Solicitud::find($id)) {
            $data = $request->json()->all();
            $solicitud->estado = $data["estado"];
            $data['tipo'] = 'Modificacion';
            if($solicitud->save()){
                \App::make('\App\Events\ModificarSolicitudEvent')->enviarNotificacion($data['tipo'], 'Un cliente a actualizado el estado de su solicitud a '.$data['estado'], $solicitud->central_id);
                return response()->json(['mensaje' => 'Registro actualizado'], 201);
            }
        } else {
            return response()->json(['mensaje' => 'El cliente no existe'], 400);
        }
    }

    public function showUltimaSolicitud($id)
    {
        $cliente = Cliente::find($id);

        if(!$cliente) {
            return JsonResponse::create(["message" => 'No se encontro el cliente puede registrarlo si continua'], 400);
        }
        $solicitud = $cliente->solicitudes()->latest()->first();
        return $solicitud;
    }

}
