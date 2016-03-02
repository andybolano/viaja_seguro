<?php namespace App\Model;


use Illuminate\Database\Eloquent\Model;

class DataSolicitudGiroPaquete extends Model
{
    protected $table = 'datos_solicitudes_girospaquetes';

    protected $guarded = ['id'];

    public $timestamps = false;

}
