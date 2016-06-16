<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\NotificacionController;
use App\Model\Central;
use App\Model\Conductor;
use App\Model\Giro;
use App\Model\Paquete;
use App\Model\Pasajero;
use App\Model\Planilla;
use App\Model\PlanillaEspecial;
use App\Model\Viaje;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class DespachoController extends Controller
{

    private function verificarTipoEmpresaCentral($central_id)
    {
        return Central::find($central_id)->load('empresa');
    }

    public function despachar(Request $request, $central_id)
    {
        $data = $request->all();
        $data['central_id'] = $central_id;
        $tipoEmpresa = $this->verificarTipoEmpresaCentral($central_id);
        if ($tipoEmpresa->empresa->tipo == '1') {
            return $this->despachoEmpresaEspecial($data);
        } else {
            return $this->despachoEmpresaNormal($data);
        }
    }

    private function despachoEmpresaEspecial($data)
    {
        $noty = new NotificacionController();
        $viaje = new Viaje();
        $viaje->conductor_id = $data['conductor']['id'];
        $viaje->ruta_id = $data['ruta']['id'];
        $viaje->fecha = date("Y-m-d");
        $viaje->save();

        if ($viaje) {
            $noty->enviarNotificacionConductores('La central a autorizado tu salida, acercate a secretaria para recivir la planilla.', $viaje->conductor_id, 'Despacho');
            $pasajeros = Pasajero::select('*')->where('conductor_id', $viaje->conductor_id)->where('estado', '=', 'Asignado')->get();
            $giros = Giro::select('*')->where('conductor_id', $viaje->conductor_id)->where('estado', '=', 'Asignado')->get();
            $paquetes = Paquete::select('*')->where('conductor_id', $viaje->conductor_id)->where('estado', '=', 'Asignado')->get();

            foreach ($pasajeros as $pasajero) {
                $viaje->pasajeros()->attach($pasajero['id']);
                $noty->enviarNotificacionClientes('El conductor a salido a recogerlo, pronto pasara por usted, sea paciente', $pasajero['identificacion'], 'Busqueda');
                $viaje['datos'] = \DB::table('datos_solicitudes_pasajeros')->where('identificacion', $pasajero->identificacion)
                    ->join('solicitudes_cliente', 'datos_solicitudes_pasajeros.solicitud_id', '=', 'solicitudes_cliente.id')
                    ->select('solicitudes_cliente.estado', 'solicitudes_cliente.id', 'solicitudes_cliente.cliente_id')
                    ->where('solicitudes_cliente.estado', '<>', 'f')->get();
                foreach ($viaje['datos'] as $dato) {
                    \DB::table('solicitudes_cliente')
                        ->where('id', $dato->id)
                        ->update(['estado' => 'v']);
                    $noty->enviarNotificacionClientes('El vehiculo a salido de la central, por favor se paciente', $dato->cliente_id, 'Vehiculo en camino');
                }
            }

            foreach ($giros as $giro) {
                $viaje->giros()->attach($giro['id']);
                $viaje['datos'] = \DB::table('datos_solicitudes_girospaquetes')
                    ->join('solicitudes_cliente', 'datos_solicitudes_girospaquetes.solicitud_id', '=', 'solicitudes_cliente.id')
                    ->join('clientes', 'solicitudes_cliente.cliente_id', '=', 'clientes.id')
                    ->join('giros', 'datos_solicitudes_girospaquetes.destinatario', '=', 'giros.nombre_receptor')
                    ->select('solicitudes_cliente.id', 'solicitudes_cliente.estado', 'solicitudes_cliente.cliente_id', 'clientes.identificacion')
                    ->where('clientes.identificacion', $giro->ide_remitente)
                    ->where('solicitudes_cliente.tipo', 'giro')
                    ->where('solicitudes_cliente.estado', '<>', 'f')
                    ->get();
                foreach ($viaje['datos'] as $dato) {
                    \DB::table('solicitudes_cliente')
                        ->where('id', $dato->id)
                        ->update(['estado' => 'v']);
                    $noty->enviarNotificacionClientes('El vehiculo a salido de la central, por favor se paciente', $dato->cliente_id, 'Vehiculo en camino');
                }
            }

            foreach ($paquetes as $paquete) {
                $viaje->paquetes()->attach($paquete['id']);
                $viaje['datos'] = \DB::table('datos_solicitudes_girospaquetes')
                    ->join('solicitudes_cliente', 'datos_solicitudes_girospaquetes.solicitud_id', '=', 'solicitudes_cliente.id')
                    ->join('clientes', 'solicitudes_cliente.cliente_id', '=', 'clientes.id')
                    ->join('paquetes', 'datos_solicitudes_girospaquetes.destinatario', '=', 'paquetes.nombre_receptor')
                    ->select('solicitudes_cliente.id', 'solicitudes_cliente.estado', 'solicitudes_cliente.cliente_id', 'clientes.identificacion')
                    ->where('clientes.identificacion', $paquete->ide_remitente)
                    ->where('solicitudes_cliente.tipo', 'paquete')
                    ->where('solicitudes_cliente.estado', '<>', 'f')
                    ->get();
                foreach ($viaje['datos'] as $dato) {
                    \DB::table('solicitudes_cliente')
                        ->where('id', $dato->id)
                        ->update(['estado' => 'v']);
                    $noty->enviarNotificacionClientes('El vehiculo a salido de la central, por favor se paciente', $dato->cliente_id, 'Vehiculo en camino');
                }
            }

            $cPlanilla = $this->crearPlanillaEspecial($viaje->id, $data['central_id']);
            if ($cPlanilla) {
                $estado = Conductor::find($viaje->conductor_id);
                $estado->estado = 'En ruta';
                $estado->save();
                if ($estado) {
                    return $cPlanilla;
                } else {
                    return JsonResponse::create('No se pudo actualizar el estado del conductor');
                }
            } else {
                return JsonResponse::create('Error al crear la planilla');
            }
        } else {
            $viaje->pasajeros()->detach();
            $viaje->paquetes()->detach();
            $viaje->giros()->detach();
            $viaje->delete();
            return JsonResponse::create('Ocurrio un error en la generacion del viaje');
        }

    }

    private function despachoEmpresaNormal($data)
    {
        $noty = new NotificacionController();
        $viaje = new Viaje();
        $viaje->conductor_id = $data['conductor']['id'];
        $viaje->ruta_id = $data['ruta']['id'];
        $viaje->fecha = date("Y-m-d");
        $viaje->save();

        if ($viaje) {
            $noty->enviarNotificacionConductores('La central a autorizado tu salida, acercate a secretaria para recivir la planilla.', $viaje->conductor_id, 'Despacho');
            $pasajeros = Pasajero::select('*')->where('conductor_id', $viaje->conductor_id)->where('estado', '=', 'Asignado')->get();
            $giros = Giro::select('*')->where('conductor_id', $viaje->conductor_id)->where('estado', '=', 'Asignado')->get();
            $paquetes = Paquete::select('*')->where('conductor_id', $viaje->conductor_id)->where('estado', '=', 'Asignado')->get();

            foreach ($pasajeros as $pasajero) {
                $viaje->pasajeros()->attach($pasajero['id']);
                $noty->enviarNotificacionClientes('El conductor a salido a recogerlo, pronto pasara por usted, sea paciente', $pasajero['identificacion'], 'Busqueda');
                $viaje['datos'] = \DB::table('datos_solicitudes_pasajeros')->where('identificacion', $pasajero->identificacion)
                    ->join('solicitudes_cliente', 'datos_solicitudes_pasajeros.solicitud_id', '=', 'solicitudes_cliente.id')
                    ->select('solicitudes_cliente.estado', 'solicitudes_cliente.id', 'solicitudes_cliente.cliente_id')
                    ->where('solicitudes_cliente.estado', '<>', 'f')->get();
                foreach ($viaje['datos'] as $dato) {
                    \DB::table('solicitudes_cliente')
                        ->where('id', $dato->id)
                        ->update(['estado' => 'v']);
                    $noty->enviarNotificacionClientes('El vehiculo a salido de la central, por favor se paciente', $dato->cliente_id, 'Vehiculo en camino');
                }
            }

            foreach ($giros as $giro) {
                $viaje->giros()->attach($giro['id']);
                $viaje['datos'] = \DB::table('datos_solicitudes_girospaquetes')
                    ->join('solicitudes_cliente', 'datos_solicitudes_girospaquetes.solicitud_id', '=', 'solicitudes_cliente.id')
                    ->join('clientes', 'solicitudes_cliente.cliente_id', '=', 'clientes.id')
                    ->join('giros', 'datos_solicitudes_girospaquetes.destinatario', '=', 'giros.nombre_receptor')
                    ->select('solicitudes_cliente.id', 'solicitudes_cliente.estado', 'solicitudes_cliente.cliente_id', 'clientes.identificacion')
                    ->where('clientes.identificacion', $giro->ide_remitente)
                    ->where('solicitudes_cliente.tipo', 'giro')
                    ->where('solicitudes_cliente.estado', '<>', 'f')
                    ->get();
                foreach ($viaje['datos'] as $dato) {
                    \DB::table('solicitudes_cliente')
                        ->where('id', $dato->id)
                        ->update(['estado' => 'v']);
                    $noty->enviarNotificacionClientes('El vehiculo a salido de la central, por favor se paciente', $dato->cliente_id, 'Vehiculo en camino');
                }
            }

            foreach ($paquetes as $paquete) {
                $viaje->paquetes()->attach($paquete['id']);
                $viaje['datos'] = \DB::table('datos_solicitudes_girospaquetes')
                    ->join('solicitudes_cliente', 'datos_solicitudes_girospaquetes.solicitud_id', '=', 'solicitudes_cliente.id')
                    ->join('clientes', 'solicitudes_cliente.cliente_id', '=', 'clientes.id')
                    ->join('paquetes', 'datos_solicitudes_girospaquetes.destinatario', '=', 'paquetes.nombre_receptor')
                    ->select('solicitudes_cliente.id', 'solicitudes_cliente.estado', 'solicitudes_cliente.cliente_id', 'clientes.identificacion')
                    ->where('clientes.identificacion', $paquete->ide_remitente)
                    ->where('solicitudes_cliente.tipo', 'paquete')
                    ->where('solicitudes_cliente.estado', '<>', 'f')
                    ->get();
                foreach ($viaje['datos'] as $dato) {
                    \DB::table('solicitudes_cliente')
                        ->where('id', $dato->id)
                        ->update(['estado' => 'v']);
                    $noty->enviarNotificacionClientes('El vehiculo a salido de la central, por favor se paciente', $dato->cliente_id, 'Vehiculo en camino');
                }
            }
            $totalD = 0;
            foreach ($data['deducciones'] as $deduccion) {
                $viaje->deducciones()->attach($deduccion['id']);
                if ($deduccion['nombre'] == 'PASAJE') {
//                    $valorP = $deduccion['valor'];
                    $valorP = 17000;

                }
                if ($deduccion['nombre'] != 'PASAJE') {
//                    $totalD += $deduccion['valor'];
//                    $totalD += $deduccion['valor'];
                }
            }
            $total = $totalD + ((count($pasajeros) * $valorP));

            $cPlanilla = $this->crearPlanillaNormal($viaje->id, $data['central_id'], $total);
            if ($cPlanilla) {
                $estado = Conductor::find($viaje->conductor_id);
                $estado->estado = 'En ruta';
                $estado->save();
                if ($estado) {
                    return $cPlanilla;
                } else {
                    return JsonResponse::create('No se pudo actualizar el estado del conductor');
                }
            } else {
                return JsonResponse::create('Error al crear la planilla');
            }
        } else {
            $viaje->pasajeros()->detach();
            $viaje->paquetes()->detach();
            $viaje->giros()->detach();
            $viaje->delete();
            return JsonResponse::create('Ocurrio un error en la generacion del viaje');
        }

    }

    public function crearPlanillaEspecial($viaje_id, $central_id)
    {
        $planilla = new PlanillaEspecial();
        $planilla->viaje_id = $viaje_id;
        $planilla->central_id = $central_id;
        $planilla->numero_planilla = $this->generarNumeroPlanillaEspecial($central_id);

        if ($planilla->save()) {
            $planilla['tipo'] = 'especial';
            return $planilla;
        } else {
            $planilla->delete();
            return JsonResponse::create('Error al crear la planilla');
        }
    }

    public function crearPlanillaNormal($viaje_id, $central_id, $total)
    {
        $planilla = new Planilla();
        $planilla->viaje_id = $viaje_id;
        $planilla->central_id = $central_id;
        $planilla->total = $total;
        $planilla->numero_planilla = $this->generarNumeroPlanillaNormal($central_id);

        if ($planilla->save()) {
            $planilla['tipo'] = 'normal';
            return $planilla;
        } else {
            $planilla->delete();
            return JsonResponse::create('Error al crear la planilla');
        }
    }

    public function generarNumeroPlanillaNormal($central_id)
    {
        $planilla = \DB::table('planilla')->where('numero_planilla',
            \DB::raw("(select max(`numero_planilla`) from planilla)"))->where('central_id', $central_id)->get();
        if (!$planilla) {
            return 'A001';
        } else {
            foreach ($planilla as $c) {
                return ++$c->numero_planilla;
            }
        }
    }

    public function generarNumeroPlanillaEspecial($central_id)
    {
        $central = Central::find($central_id)->load('empresa', 'ciudad.departamento');
        $cterritorial = $central->ciudad->departamento->codigoT;
        $nrE = $central->empresa->nresolucion;
        $dUano = substr($central->empresa->fecha_resolucion, 2, 2);
        $anoActual = date("Y");
        if (!$nrE) {
            $nrE = 0000;
        }
        $cCompleto = $cterritorial . $nrE . $dUano . $anoActual;
        $planilla = \DB::table('planilla_especial')->where('numero_planilla',
            \DB::raw("(select max(`numero_planilla`) from planilla_especial)"))->where('central_id', $central_id)->get();
        if (!$planilla) {
            return $cCompleto . '00000001';
        } else {
            foreach ($planilla as $c) {
                $incrementar = substr($c->numero_planilla, 13, 8);//obtengo ultimos 8 digitos
                //$sumar = substr_count($incrementar, '0');//cuento la cantidad de ceros exitentes en esos numeros
                $incremento = ++$incrementar;//asigno el numero a incrementar
                $numero_completo = $cCompleto.str_pad($incremento, 8, "0", STR_PAD_LEFT);//porque lo parseas?

                //completo el codigo completo y concateno con sumar+1 ceros y el numero que incrementa hacia la izq
                return $numero_completo;
            }
        }
    }
}
