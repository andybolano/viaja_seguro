<?php

namespace App\Http\Controllers;

use App\Model\Central;
use Vinkla\Pusher\PusherManager;
use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Model\Cliente;

class PdfController extends Controller
{
    protected $pusher;

    public function __construct(PusherManager $pusher)
    {
        $this->pusher = $pusher;
    }

    public function bar()
    {
        $this->pusher->trigger('solicitudes', 'NuevaSolicitudEvent', ['message' => 'La prueba']);
    }

    private function verificarCliente($identificacion)
    {
        return $cliente = Cliente::where('identificacion', $identificacion)->first();

    }

    private function createCliente($cliente)
    {
        $usuario = $this->crearUsuarioPasajero($cliente['identificacion']);
        $cliente = new Cliente();
        $cliente->identificacion = $cliente['identificacion'];
        $cliente->nombres = $cliente['nombres'];
        $cliente->telefono = $cliente['telefono'];
        $cliente->direccion = $cliente['direccion'];
        $cliente->usuario_id = $cliente->id;

        return array('cliente' => $cliente->save(), 'usuario' => $usuario);

    }

    public function invoice(Request $request)
    {
        $data = $request->json()->all();

        $ecliente = $this->verificarCliente($data['identificacion']);
        if (!$ecliente) {
            $cliente = $this->createCliente($data);
            if ($cliente['cliente']) {
                if ($cliente['usuario']) {
                    $pasajero = new Pasajero($data);
                    $pasajero->identificacion = $data['identificacion'];
                    $pasajero->nombres = $data['nombres'];
                    $pasajero->telefono = $data['telefono'];
                    $pasajero->direccion = $data['direccion'];
                    $pasajero->central_id = $data['central_id'];
                    if ($pasajero->save()) {
                        return JsonResponse::create(array('message' => "Se puso en espera al pasajero correctamente", 200));
                    } else {
                        return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
                    }
                } else {
                    $cliente['usuario']->delete();
                    return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
                }
            } else {
                return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
            }
        } else {
            $pasajero = new Pasajero($data);
            $pasajero->identificacion = $data['identificacion'];
            $pasajero->nombres = $data['nombres'];
            $pasajero->telefono = $data['telefono'];
            $pasajero->direccion = $data['direccion'];
            $pasajero->central_id = $central_id;
            if ($pasajero->save()) {
                return JsonResponse::create(array('message' => "Se puso en espera al pasajero correctamente", 200));
            } else {
                return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
            }
        }


        $central = Central::find($central_id);
        if (!$central->pasajeros()->save($pasajero)) {
            $pasajero->delete();
            return response()->json(['message' => 'no se ha podido almacenar el registro'], 400);
        }
    }
}
