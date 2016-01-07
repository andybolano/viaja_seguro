<?php

Route::resource('/api/servicios_empresa', 'ServicioEmpresaController');

Route::get('/api/empresa/obtener/pasajeros', 'Empresa\ServiciosController@getPasajeros');
Route::get('/api/empresa/obtener/giros', 'Empresa\ServiciosController@getGiros');
Route::get('/api/empresa/obtener/paquetes', 'Empresa\ServiciosController@getPaquetes');