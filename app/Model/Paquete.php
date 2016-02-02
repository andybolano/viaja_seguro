<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Paquete extends Model
{
    protected $table = 'paquetes';

    protected $fillable = ['ide_remitente', 'nombres', 'telefono', 'direccion', 'nombre_receptor',
        'telefono_receptor', 'descripcion_paquete', 'direccionD', 'conductor_id', 'central_id'];

    public $timestamps = false;

    public function central()
    {
        return $this->belongsTo(Central::class)->select('id', 'empresa_id', 'direccion', 'telefono');
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