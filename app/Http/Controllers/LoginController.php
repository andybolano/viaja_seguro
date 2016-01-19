<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoginController extends Controller
{

    public function autenticarUsuario(Request $request)
    {
        $username = $request->json()->get('name');
        $userpass = $request->json()->get('pass');
        if($username == 'admin' && $userpass == '1234'){
            return ['name' => $username, 'pass' => $userpass, 'rol' => 'superadmin'];
        }else if($username == 'empresa1' && $userpass == '1234'){
            return ['name' => $username, 'pass' => $userpass, 'rol' => 'userempresa'];
        }else if($username == 'central1' && $userpass == '1234'){
            return ['name' => $username, 'pass' => $userpass, 'rol' => 'usercentral'];
        } else {
            return response()->json(['mensajeError' => 'Usuario o contraseña incorrectos'], 401);
        }
    }

}