<?php
/**
 * Created by PhpStorm.
 * User: Jose
 * Date: 16/07/2016
 * Time: 12:39 AM
 */

namespace app\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Model\Central;
use App\Model\Ruta;
use Symfony\Component\HttpFoundation\JsonResponse;


class RutasController extends Controller
{
    public function getRutas($central_id)
    {
        $central = Central::find($central_id);
        $rutas = [];
        foreach ($central->rutas as $ruta) {
            $rutas[] = [
                'id' => $ruta->id,
                'destino' => $ruta->destino->load('ciudad'),
                'n_conductores' => count($ruta->turnos),
            ];
        }
        return $rutas;
    }

    public function getConductoresDeRuta($central_id, $ruta_id)
    {
        return Ruta::find($ruta_id)->turnos->load('conductor');
    }

    public function getSolicitudesDeRuta($ruta_id)
    {
        $ruta = Ruta::find($ruta_id);
        return array(
            'solicitud_nuevos_pasajeros' => $ruta->solicitudes()
                ->where(['tipo' => 'pasajero', 'estado' => 'p'])->get()->load('datos_pasajeros'),
            'solicitud_pasajeros' => $ruta->solicitudes()
                ->where(['tipo' => 'vehiculo', 'estado' => 'p'])->get()->load('datos_pasajeros'),
            'solicitud_paquetes' => $ruta->solicitudes()
                ->where(['tipo' => 'paquete', 'estado' => 'p'])->get()->load('detalles'),
            'solicitud_giros' => $ruta->solicitudes()
                ->where(['tipo' => 'giro', 'estado' => 'p'])->get()->load('detalles')
        );
    }
}