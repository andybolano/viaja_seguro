<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Documentacion extends Model
{
    protected $table = 'documentacion';

    public $timestamps = false;

    protected $fillable = ['nombre'];

    public function vehiculos(){
        return $this->belongsToMany(Vehiculo::class, 'documentacion_vehiculo', 'ide_vehiculo', 'ide_documentacion', 'fecha_vencimiento');
    }
}