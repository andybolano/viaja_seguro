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

    Route::group(['middleware' => 'jwt.auth'],function () {

        include 'Routes/Conductores.php';
        include 'Routes/Vehiculos.php';
        include 'Routes/Cliente.php';
        include 'Routes/Paquetes.php';
        include 'Routes/Pasajeros.php';
        include 'Routes/Giros.php';
        include 'Routes/Pagos.php';
        include 'Routes/Deducciones.php';
        include 'Routes/Actividades.php';

        include('Routes/Empresas.php');
        include('Routes/Rutas.php');
        include('Routes/Centrales.php');
        include('Routes/ServiciosEmpresa.php');
        include('Routes/Ciudades.php');

        include('Routes/Usuarios.php');

    });

});
