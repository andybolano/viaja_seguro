<?php
Route::resource('/api/empresa/conductores', 'Empresa\ConductorController');
Route::put('/api/empresa/conductores/{id}', 'Empresa\ConductorController@update');
Route::delete('/api/empresa/conductores/{id}', 'Empresa\ConductorController@destroy');
Route::get('/api/empresa/conductores/getVehiculo/{id}', 'Empresa\ConductorController@getVehiculo');
//imagen
Route::post('/api/empresas/conducdor/imagen/{id}', 'Empresa\ConductorController@guardaImagen');