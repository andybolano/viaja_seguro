<?php

Route::get('/api/empresas/{empresa_id}/centrales', 'Empresa\CentralesController@index');
Route::post('/api/empresas/{empresa_id}/centrales', 'Empresa\CentralesController@store');
Route::put('/api/centrales/{central_id}', 'Empresa\CentralesController@update');
Route::delete('/api/centrales/{central_id}', 'Empresa\CentralesController@destroy');

Route::get('/api/centrales/{central_id}/vehiculos', 'Empresa\CentralesController@getVehiculos');
Route::get('/api/centrales/{central_id}/conductores', 'Empresa\CentralesController@getConductores');

Route::get('/api/centrales/{central_id}/rutas', 'Empresa\CentralesController@getRutas');