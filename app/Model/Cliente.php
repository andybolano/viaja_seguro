<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'clientes';

    protected $guarded = ['id'];

    public $timestamps = false;

    public function pasajeros()
    {
        return $this->hasMany(Pasajero::class);
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class);
    }

    public function giros()
    {
        return $this->hasMany(Giro::class);
    }

    public function paquetes()
    {
        return $this->hasMany(Paquete::class);
    }

    public function ciudad()
    {
        return $this->hasOne(Municipio::class);
    }
}
