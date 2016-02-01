<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = 'vehiculos';

    public $timestamps = false;

    protected $casts = ['soat' => 'boolean', 'tecnomecanica' => 'boolean',
        'tarjeta_propiedad' => 'boolean' ];

    protected $fillable = ['id', 'imagen', 'placa', 'modelo', 'color', 'codigo_vial', 'identificacion_propietario', 'nombre_propietario',
        'tel_propietario', 'cupos', 'soat', 'fecha_soat', 'tecnomecanica'
    , 'fecha_tecnomecanica', 'tarjeta_propiedad', 'conductor_id'];

    public function conductor(){
        return $this->belongsTo(Conductor::class)->select('identificacion', 'id', 'nombres', 'apellidos');
    }

    public function documentacion(){
        return $this->belongsToMany(Documento::class, 'documentos_vehiculo', 'vehiculo_id', 'documento_id', 'fecha_vencimiento');
    }

}
