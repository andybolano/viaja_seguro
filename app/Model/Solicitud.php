<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Solicitud
 *
 * @package \App\Model
 */
class Solicitud extends Model
{
    protected $table = 'solicitudes_cliente';

    protected $guarded = ['id'];

    public $timestamps = false;

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function central()
    {
        return $this->belongsTo(Central::class);
    }

    public function datos_pasajeros()
    {
        return $this->hasMany(DataSolicitudPasajero::class);
    }

    public function datos_giros()
    {
        return $this->hasMany(DataSolicitudGiroPaquete::class);
    }

    public function datos_paquetes()
    {
        return $this->hasMany(DataSolicitudGiroPaquete::class);
    }
}
