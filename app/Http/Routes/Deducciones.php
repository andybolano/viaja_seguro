<?php

Route::get('/api/empresas/{empresa_id}/deducciones', 'Empresa\DeduccionesController@index');
Route::post('/api/empresas/{empresa_id}/deducciones', 'Empresa\DeduccionesController@store');
Route::put('/api/deducciones/{deduccion_id}', 'Empresa\DeduccionesController@update');
Route::put('/api/deducciones/{deduccion_id}/estado/{valor_estado}', 'Empresa\DeduccionesController@updateEstado');
Route::delete('/api/deducciones/{deduccion_id}', 'Empresa\DeduccionesController@destroy');

