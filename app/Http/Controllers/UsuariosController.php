<?php namespace App\Http\Controllers;

use App\Model\Conductor;
use App\Model\Empresa;
use App\Model\Rol;
use App\Model\Usuario;
use Illuminate\Http\Request;
use JWTAuth;

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
        } catch (\Exception $e) {
            return response()->json(['error' => 'User already exists.'], 409);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('token'));
    }

    public function registrarConductor(Request $request)
    {
        $data = $request->json()->all();
        $user = Usuario::nuevo($data['identificacion'], $data['contrasena'], $this->getRol('CONDUCTOR')->id);
        unset($data['contrasena']);
        $data['usuario_id'] = $user->id;
        unset($data['vehiculo']);
        $empresa_id = $data['empresa_id'];
        unset($data['empresa_id']);

        $vehiculo_conductor = $data['vehiculo'];
        unset($data['vehiculo']);

        $conductor = new Conductor($data);
        $empresa = Empresa::find($empresa_id);
        if(!$empresa->conductores()->save($conductor)){
            $user->delete();
            return response()->json(['mensajeError' => 'no se ha podido almacenar el registro'], 400);
        }
        $this->storeVehiculoconductor($conductor, $vehiculo_conductor);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('token'));
    }

    private function storeVehiculoconductor(&$conductor, $data){
        $busqueda = Vehiculo::select("placa")
            ->where("placa",$data["placa"])
            ->first();
        if ($busqueda == null) {
            if(!$conductor->vehiculo()->save(new Vehiculo($data))){
                $conductor->usuario->delete();
                $conductor->delete();
                return response()->json(['mensajeError' => 'no se ha podido almacenar el vehiculo dle conductor'], 400);
            }
            return response()->json($conductor, 200);
        }else{
            return response()->json(array('message' => "La placa del vehiculo ya se encuentra registrada."), 200);
        }
    }

    private function getRol($nombre)
    {
        return Rol::where('nombre', $nombre)->first();
    }

}