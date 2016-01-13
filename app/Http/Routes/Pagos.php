<?php

Route::get('/api/empresa/pagos/planilla', 'Empresa\PagosController@getPlanillas');
Route::get('/api/empresa/pagos/ahorro', 'Empresa\PagosController@getAhorros');
Route::get('/api/empresa/pagos/pension', 'Empresa\PagosController@getPension');
Route::get('api/empresa/pagos/seguridad', 'Empresa\PagosController@getSeguridad');