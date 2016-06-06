<?php
/**
 * Created by Jose Soto.
 * Date: 5/06/2016
 * Time: 9:34 AM
 */
Route::get('/api/centrales/{central_id}/planillaEspecial/{planilla_id}', 'Central\PlanillaController@obtenerDatosPlanillaEspecial');
Route::get('/api/centrales/{central_id}/planillaNormal/{planilla_id}', 'Central\PlanillaController@obtenerDatosPanillaNormal');