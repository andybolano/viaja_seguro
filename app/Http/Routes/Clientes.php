<?php

Route::resource('api/empresa/clientes', 'Empresa\ClienteController');
Route::put('/api/empresa/clientes/{id}', 'Empresa\ClienteController@update');
Route::delete('/api/empresa/clientes/{id}', 'Empresa\ClienteController@destroy');