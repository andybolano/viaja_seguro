<?php namespace App\Http\Controllers;

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
            if(password_verify($credentials['password'] , $user->password)) {
                $token = JWTAuth::fromUser($user, ['usuario' => ['id' => $user->id, 'nombre' => $user->email, 'estado' => $user->estado, 'rol' => $user->rol->nombre]]);

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

    public function singUp(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $credentials['password'] = password_hash($credentials['password'], PASSWORD_DEFAULT);
        $credentials['rol_id'] = 1;

        try {
            $user = Usuario::create($credentials);
        } catch (Exception $e) {
            return response()->json(['error' => 'User already exists.'], \HttpResponse::HTTP_CONFLICT);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('token'));
    }
//    public function autenticarUsuario(Request $request)
//    {
//        $username = $request->json()->get('name');
//        $userpass = $request->json()->get('pass');
//        if($username == 'admin' && $userpass == '1234'){
//            return ['name' => $username, 'pass' => $userpass, 'rol' => 'superadmin'];
//        }else if($username == 'empresa1' && $userpass == '1234'){
//            return ['name' => $username, 'pass' => $userpass, 'rol' => 'userempresa'];
//        }else if($username == 'central1' && $userpass == '1234'){
//            return ['name' => $username, 'pass' => $userpass, 'rol' => 'usercentral'];
//        } else {
//            return response()->json(['mensajeError' => 'Usuario o contraseña incorrectos'], 401);
//        }
//    }

}