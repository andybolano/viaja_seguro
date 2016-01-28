<?php
Route::get('api/empresa/vehiculo/getVehiculoEnTurno', 'Empresa\VehiculoController@getVehiculoEnTurno');

Route::post('/api/vehiculos/{vehiculo_id}/imagen', 'Empresa\VehiculoController@guardaImagen');
Route::put('/api/vehiculos/{vehiculo_id}', 'Empresa\VehiculoController@update');