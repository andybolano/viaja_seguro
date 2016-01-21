<?php namespace App\Http\Controllers;

use App\Model\Usuario;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UsuariosController extends Controller
{

    public function updatePassword(Request $request, $id)
    {
        $contrasena_actual = $request->get('actual');
        $contrasena_nueva = $request->get('nueva');
            $user = Usuario::find($id);
            if(password_verify($contrasena_actual , $user->password)) {
                $user->password = password_hash($contrasena_nueva, PASSWORD_DEFAULT);
                $user->estado = 1;
                $user->save();

//                $token = JWTAuth::fromUser($user, [
//                    'usuario' => [
//                        'id' => $user->id,
//                        'nombre' => $user->email,
//                        'estado' => $user->estado,
//                        'rol' => $user->rol->nombre
//                    ]]);

            } else {
                return response()->json(['mensajeError' => 'Contraseña incorrecta'], 401);
            }
        return response()->json(['mensaje' => 'Contraseña actualizada'], 200);
    }

    public function create(Request $request)
    {
        try {
            $user = Usuario::nuevo($request->get('name'), $request->get('pass'), $request->get('id_rol'));
        } catch (Exception $e) {
            return response()->json(['error' => 'User already exists.'], \HttpResponse::HTTP_CONFLICT);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('token'));
    }

}