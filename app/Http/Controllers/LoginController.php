<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoginController extends Controller
{

    public function autenticarUsuario(Request $request)
    {
        $username = $request->json()->get('name');
        $userpass = $request->json()->get('pass');
        if($username == 'admin' && $userpass == 'admin'){
            return ['name' => $username, 'pass' => $userpass];
        } else {
            return response()->json(['mensajeError' => 'Usuario o contraseña incorrectos'], 401);
        }
    }

}