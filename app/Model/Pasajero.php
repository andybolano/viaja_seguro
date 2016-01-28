<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Pasajero extends Model
{
    protected $table = 'pasajeros';

    protected $fillable = ['identificacion', 'nombres', 'apellidos', 'telefono', 'origen', 'destino', 'vehiculo'];

    public $timestamps = false;

    public function central()
    {
        return $this->belongsTo(Central::class)->select('id', 'empresa_id', 'direccion', 'telefono');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}