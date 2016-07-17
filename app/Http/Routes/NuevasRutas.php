<?php
/**
 * Created by PhpStorm.
 * User: Jose
 * Date: 16/07/2016
 * Time: 12:39 AM
 */

Route::get('/api/central/{central_id}/obtener_rutas', 'Central\RutasController@getRutas');
Route::get('/api/central/{central_id}/ruta/{ruta_id}/get_conductoresDeRuta', 'Central\RutasController@getConductoresDeRuta');
Route::get('/api/central/ruta/{ruta_id}/getSolicitudesDeRuta', 'Central\RutasController@getSolicitudesDeRuta');