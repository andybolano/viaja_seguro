<?php
Route::get('/api/clientes', 'Cliente\ClienteController@index');
Route::post('/api/clientes', 'Cliente\ClienteController@store');
Route::post('/api/clientes/{cliente_id}/imagen', 'Cliente\ClienteController@storeImagen');
Route::put('/api/clientes/{cliente_id}', 'Cliente\ClienteController@update');
Route::delete('/api/clientes/{cleinte_id}', 'Cliente\ClienteController@destroy');

Route::get('/api/central/clientes/{cliente_id}', 'Cliente\ClienteController@show');

Route::get('/api/clientes/{cliente_id}/solicitudes', 'Cliente\ClienteController@showUltimaSolicitud');
Route::post('/api/clientes/{cliente_id}/solicitudes', 'Cliente\ClienteController@newSolicitud');
Route::put('/api/clientes/{cliente_id}/solicitudes/{id}', 'Cliente\ClienteController@updateSolicitud');
