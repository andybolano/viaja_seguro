<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = 'vehiculos';

    public $timestamps = false;

    protected $fillable = ['id', 'imagen', 'placa', 'modelo', 'color', 'codigo_vial', 'ide_propietario', 'nombre_propietario', 'tel_propietario', 'cupos', 'conductor_id'];

    public function ciudadCentral(){
        return $this->hasManyThrough(Central::class, Ciudad::class, 'id', 'ciudad_id', 'central_id');
    }

    public function conductor(){
        return $this->belongsTo(Conductor::class);
    }

    public function documentacion(){
        return $this->belongsToMany(Documento::class, 'documentos_vehiculo', 'vehiculo_id', 'documento_id', 'fecha_vencimiento');
    }

    public function central(){
        return $this->belongsTo(Central::class);
    }


}
