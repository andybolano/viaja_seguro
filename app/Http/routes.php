<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    echo '<script>location.href="app";</script>';
});
Route::get('pdf', 'PdfController@invoice');
Route::group(['middleware' => 'cors'], function () {
    Route::post('/api/login', 'LoginController@autenticarUsuario');
    Route::get('/api/new_token', 'LoginController@refreshToken');

    Route::post('/api/usuarios/clientes', 'Cliente\ClienteController@store');
    Route::post('/api/usuarios/conductores', 'UsuariosController@registrarConductor');

    Route::get('/api/empresas', 'SuperAdmin\EmpresaController@index');
    Route::get('/api/departamentos', 'SuperAdmin\CiudadesController@getDepartamentos');
    Route::get('/api/departamentos/{dpto_id}/municipios', 'SuperAdmin\CiudadesController@getMunicipios');

    Route::group(['middleware' => 'jwt.auth'], function () {

//        $ruta = realpath($_SERVER["DOCUMENT_ROOT"] . "/../app/Http/Routes");
//        foreach (glob("$ruta/*.php") as $filename) {
//            include_once $filename;
//        }

        $ruta = $_SERVER["DOCUMENT_ROOT"]."/viaja_seguro/"."app/Http/Routes";
        foreach (glob("$ruta/*.php") as $filename)
        {
            include_once $filename;
        }
    });

    Route::get('/api/assets/sounds/notySolicitudes', function () {
        $filename = "../public/assets/sounds/noty.mp3";
        $filesize = (int)File::size($filename);
        $file = File::get($filename);
        $response = Response::make($file, 200);
        $response->header('Content-Type', 'audio/mpeg');
        $response->header('Content-Length', $filesize);
        $response->header('Accept-Ranges', 'bytes');
        $response->header('Content-Range', 'bytes 0-' . $filesize . '/' . $filesize);
        return $response;
    });
});
