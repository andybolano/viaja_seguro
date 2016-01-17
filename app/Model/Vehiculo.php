<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = 'vehiculos';

    public $timestamps = false;

    protected $fillable = ['imagen', 'placa', 'modelo', 'color', 'codigo_vial', 'ide_propietario', 'nombre_propietario', 'tel_propietario', 'cupos'];

    public function conductor(){
        return $this->hasOne(Conductor::class, 'id');
    }

    public function documentacion(){
        return $this->belongsToMany(Documentacion::class, 'documentacion_vehiculo', 'ide_vehiculo', 'ide_documentacion', 'fecha_vencimiento');
    }
}
