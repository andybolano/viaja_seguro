<?php
Route::resource('/api/empresas/{empresa_id}/conductores', 'Empresa\ConductorController');
Route::put('/api/empresas/{empresa_id}/conductores/{id}', 'Empresa\ConductorController@update');
Route::delete('/api/empresas/{empresa_id}/conductores/{id}', 'Empresa\ConductorController@destroy');
Route::get('/api/empresa/conductores/getVehiculo/{id}', 'Empresa\ConductorController@getVehiculo');
//imagen
Route::post('/api/empresas/conducdor/imagen/{id}', 'Empresa\ConductorController@guardaImagen');