<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Conductor extends Model
{
    protected $table = 'conductores';

    protected $fillable = ['vehiculo_id', 'identificacion', 'nombres', 'apellidos', 'imagen', 'telefono', 'direccion', 'correo'];

    public $timestamps = false;

    public function vehiculo(){
        return $this->hasOne(Vehiculo::class);
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class)->select('id', 'nombre');
    }
}