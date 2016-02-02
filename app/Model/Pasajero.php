<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Pasajero extends Model
{
    protected $table = 'pasajeros';

    protected $fillable = ['identificacion', 'nombres', 'telefono', 'direccion', 'direccionD', 'conductor_id', 'central_id'];

    public $timestamps = false;

    public function central()
    {
        return $this->belongsTo(Central::class)->select('id', 'empresa_id', 'direccion', 'telefono');
    }

    public function conductor()
    {
        return $this->belongsTo(Conductor::class);
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }
}