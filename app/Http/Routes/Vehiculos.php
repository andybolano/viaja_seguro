<?php
Route::resource('api/empresa/vehiculos','Empresa\VehiculoController');

Route::get('api/empresa/vehiculo/getVehiculoEnTurno', 'Empresa\VehiculoController@getVehiculoEnTurno');

Route::post('/api/empresas/vehiculo/imagen/{id}', 'Empresa\VehiculoController@guardaImagen');