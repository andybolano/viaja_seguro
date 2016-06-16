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

    public function invoice()
    {
        return str_pad((int) 2,7,"0",STR_PAD_LEFT);
    }
}
