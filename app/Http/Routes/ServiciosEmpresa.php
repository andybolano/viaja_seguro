<?php

Route::resource('/api/servicios_empresa', 'SuperAdmin\ServicioEmpresaController');

Route::get('api/empresa/vehiculo/getCliente/{id}', 'Empresa\ServiciosController@getCliente');