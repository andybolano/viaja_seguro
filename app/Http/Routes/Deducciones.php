<?php

Route::resource('/api/empresa/deducciones','Empresa\DeduccionesController');
Route::put('/api/empresa/deducciones/{id}/{estado}', 'Empresa\DeduccionesController@updateEstado');