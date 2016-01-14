<?php
Route::resource('/api/empresa/conductores', 'Empresa\ConductorController');
Route::put('/api/empresa/conductores/{id}', 'Empresa\ConductorController@update');
Route::delete('/api/empresa/conductores/{id}', 'Empresa\ConductorController@destroy');