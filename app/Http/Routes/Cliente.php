<?php
Route::get('/api/clientes', 'Cliente\ClienteController@index');
Route::post('/api/clientes', 'Cliente\ClienteController@store');
Route::post('/api/clientes/{cliente_id}/imagen', 'Cliente\ClienteController@storeImagen');
Route::put('/api/clientes/{cliente_id}', 'Cliente\ClienteController@update');
Route::delete('/api/clientes/{cleinte_id}', 'Cliente\ClienteController@destroy');