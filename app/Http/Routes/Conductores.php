<?php
Route::post('/api/empresas/{empresa_id}/conductores','Empresa\ConductorController@store');
Route::get('/api/conductores/{conductor_id}', 'Empresa\ConductorController@show');
Route::post('/api/conductores/{conductor_id}/imagen', 'Empresa\ConductorController@guardaImagen');
Route::put('/api/conductor/{conductor_id}', 'Empresa\ConductorController@update');
Route::delete('/api/conductor/{conductor_id}', 'Empresa\ConductorController@destroy');
Route::get('/api/conductores/{conductor_id}/vehiculo', 'Empresa\ConductorController@getVehiculo');
Route::post('/api/conductores/{conductor_id}/vehiculo', 'Empresa\ConductorController@postVehiculo');





