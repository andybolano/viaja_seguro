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
    echo '<script>location.href=\'login.html\';</script>';
});

Route::post('/api/login', 'LoginController@autenticarUsuario');

include 'Routes/Conductores.php';
include 'Routes/Vehiculos.php';
include 'Routes/Clientes.php';
include 'Routes/Pagos.php';
include 'Routes/Deducciones.php';

include('Routes/Empresas.php');
include('Routes/ServiciosEmpresa.php');
