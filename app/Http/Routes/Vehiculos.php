<?php
Route::resource('api/empresa/vehiculos','Empresa\VehiculoController');

Route::get('api/empresa/vehiculo/getVehiculoEnTurno', 'Empresa\VehiculoController@getVehiculoEnTurno');

Route::post('/api/empresas/vehiculo/imagen/{id}', 'Empresa\VehiculoController@guardaImagen');

Route::get('/api/empresa/documentacion', 'Empresa\VehiculoController@getDocumentacion');

Route::put('/api/vehiculos/{vehiculo_id}', 'Empresa\VehiculoController@update');