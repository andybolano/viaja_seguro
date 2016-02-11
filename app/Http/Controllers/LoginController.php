<?php namespace App\Http\Controllers;

use App\Model\Central;
use App\Model\Empresa;
use App\Model\Usuario;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class LoginController extends Controller
{

    public function autenticarUsuario(Request $request)
    {
        // credenciales para loguear al usuario
        $credentials['email'] = $request->get('name');
        $credentials['password'] = $request->get('pass');

        try {
            $user = Usuario::where('email' ,$credentials['email'])->first();
            if($user && password_verify($credentials['password'] , $user->password)) {
                $token = JWTAuth::fromUser($user, $this->getData($user));
            } else {
                return response()->json(['mensajeError' => 'Usuario o contraseña incorrectos'], 401);
            }
        } catch (JWTException $e) {
            // si no se puede crear el token
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // todo bien devuelve el token
        return response()->json(compact('token'));
    }

    private function getData($user)
    {
        $data = [
            'usuario' => [
                'id' => $user->id,
                'nombre' => $user->email,
                'estado' => $user->estado,
                'rol' => $user->rol->nombre
            ]];
        switch($user->rol->nombre){
            case 'EMPRESA':
                $empresa = Empresa::where('usuario_id', $user->id)->first();
                $data['usuario']['empresa'] = [
                    'id' => $empresa->id,
                    'nombre' => $empresa->nombre,
                    'servicios' => $this->checkServiciosEmpresa($empresa->servicios)
                ];

                $data['usuario']['imagen'] =  $empresa->logo;
                break;
            case 'CENTRAL_EMPRESA':
                $central = Central::where('usuario_id', $user->id)->first();
                $data['usuario']['central'] = [
                    'id' => $central->id,
                    'nombre' => $central->nombre,
                    'ciudad' => $central->ciudad,
                    'empresa' => [
                        'id' => $central->empresa->id,
                        'nombre' => $central->empresa->nombre,
                        'servicios' => $this->checkServiciosEmpresa($central->empresa->servicios)
                    ],
                    'miDireccionLa' => $central->miDireccionLa,
                    'miDireccionLo' => $central->miDireccionLo
                ];

                $data['usuario']['imagen'] =  $central->empresa->logo;
                break;
        }
        return $data;
    }

    private function checkServiciosEmpresa($e_servicios)
    {
        $servicios = [];
        foreach ($e_servicios as $servicio) {
            if($servicio->concepto == 'Reservas de pasajes')
                $servicios['gestion_pasajeros'] = true;
            if($servicio->concepto == 'Giros')
                $servicios['giros'] = true;
            if($servicio->concepto == 'Encomiendas')
                $servicios['encomiendas'] = true;
            if($servicio->concepto == 'Gestion de Pagos')
                $servicios['gestion_pagos'] = true;
        }
        return $servicios;
    }

}