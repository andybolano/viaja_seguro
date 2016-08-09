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

    public function datos_giros_paquetes(){
        return $this->hasMany(DataSolicitudGiroPaquete::class);
    }

    public function detalles()
    {
        return $this->hasMany(DataSolicitudGiroPaquete::class);
    }
}
