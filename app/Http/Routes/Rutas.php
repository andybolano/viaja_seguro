<?php
Route::post('/api/empresas/{empresa_id}/rutas', 'Empresa\RutasController@store');
Route::delete('/api/rutas/{ruta_id}', 'Empresa\RutasController@destroy');

Route::get('/api/rutas/{ruta_id}/turnos', 'Empresa\RutasController@getConductoresEnTurno');
Route::put('/api/rutas/{ruta_id}/turnos', 'Empresa\RutasController@updateConductoresEnTurno');

//rutas de despacho
Route::get('/api/rutas/{ruta_id}/turno/primero', 'Empresa\ViajesController@getTurno');
Route::post('/api/rutas/turnos/conductor', 'Empresa\ViajesController@deleteTurno');
