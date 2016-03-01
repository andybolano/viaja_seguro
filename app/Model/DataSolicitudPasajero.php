<?php namespace App\Model;


use Illuminate\Database\Eloquent\Model;

class DataSolicitudPasajero extends Model
{
    protected $table = 'datos_solicitudes_pasajeros';

    protected $guarded = ['id'];

    public $timestamps = false;

}
