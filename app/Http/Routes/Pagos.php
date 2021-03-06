<?php

Route::get('/api/prestaciones', 'Empresa\PagosController@getPrestaciones');
Route::get('/api/empresas/{empresa_id}/pagos_prestaciones/{prestacion_id}', 'Empresa\PagosController@getPagosEmpresaPrestacion');
Route::get('/api/conductores/{conductor_id}/pagos_prestaciones/{prestacion_id?}', 'Empresa\PagosController@getPagosConductor');
Route::post('/api/conductores/{conductor_id}/pagos_prestaciones', 'Empresa\PagosController@storePago');

Route::get('/api/centrales/{central_id}/planillas', 'Empresa\PagosController@getPlanillas');
Route::get('/api/central/{central_id}/pagos/planilla/{planilla_id}', 'Empresa\PagosController@getPlanilla');