<?php
Route::get('/api/empresas/{empresa_id}/agenda_actividades', 'Empresa\ActividadesController@index');
Route::get('/api/empresas/{empresa_id}/agenda_actividades/{actividad_id}', 'Empresa\ActividadesController@show');
Route::post('/api/empresas/{empresa_id}/agenda_actividades', 'Empresa\ActividadesController@store');
Route::put('/api/agenda_actividades/{actividad_id}', 'Empresa\ActividadesController@update');