<?php namespace App\Http\Controllers;

use App\Model\Central;
use App\Model\Cliente;
use App\Model\Empresa;
use App\Model\Usuario;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class LoginController extends Controller
{

    public function autenticarUsuario(Request $request)
    {
        // credenciales para loguear al usuario
        $credentials['email'] = $request->get('name');
        $credentials['password'] = $request->get('pass');
        $login_ip = $request->get('pip');

        try {
            if($user = Usuario::where('email' ,$credentials['email'])->first()) {
                if($user->rol->nombre == 'CENTRAL_EMPRESA' && $user->only_ip && $user->valid_ip != $login_ip){
                    return response()->json(['mensajeError' => 'No tiene acceso'], 401);
                } elseif ($user->rol->nombre == 'CENTRAL_EMPRESA' && !$user->only_ip){
                    $user->valid_ip = $login_ip;
                    $user->save();
                }
                if (password_verify($credentials['password'], $user->password)) {
                    $token = JWTAuth::fromUser($user, $this->getData($user));

                    // todo bien devuelve el token
                    return response()->json(compact('token'));
                } else {
                    return response()->json(['mensajeError' => 'Usuario o contraseña incorrectos'], 401);
                }
            } else {
                return response()->json(['mensajeError' => 'Usuario o contraseña incorrectos'], 401);
            }
        } catch (JWTException $e) {
            // si no se puede crear el token
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
    }

    public function refreshToken()
    {
        $token = JWTAuth::getToken();
        if(!$token){
            return response()->json(['Token not provided'], 401);
        }
        try{
            $token = JWTAuth::refresh($token);
        }catch(TokenInvalidException $e){
            return response()->json(['messageError' => $e->getMessage()], 403);
        }
        return response()->json(['token'=>$token]);
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
            case 'CLIENTE':
                $cliente = Cliente::where('usuario_id', $user->id)->first();
                $data['usuario']['nombre'] = $cliente->nombres.' '.$cliente->apellidos;
                $data['usuario']['email'] = $cliente->email;
                $data['usuario']['identificacion'] = $cliente->identificacion;
                $data['usuario']['telefono'] = $cliente->telefono;
                $data['usuario']['imagen'] =  $cliente->imegen;
                $data['usuario']['cliente_id'] =  $cliente->id;
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
