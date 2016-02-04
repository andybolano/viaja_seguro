<?php namespace App\Model;


use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    protected $table = 'actividades_agendadas';

    protected $guarded = ['id'];

    public $timestamps = false;
}