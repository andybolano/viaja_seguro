<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Central extends Model
{

    protected $table = 'centrales';

    protected $guarded = ['id'];

    public $timestamps = false;

    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class);
    }

    public function rutas()
    {
        return $this->hasMany(Ruta::class, 'id_central_origen', 'id')->select('id', 'id_central_destino');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function conductores()
    {
        return $this->hasMany(Conductor::class);
    }

    public function vehiculos()
    {
        return $this->hasManyThrough(Vehiculo::class, Conductor::class);
    }

    public function pasajeros()
    {
        return $this->hasMany(Pasajero::class);
    }

    public function giros()
    {
        return $this->hasMany(Giro::class);
    }

    public function paquetes()
    {
        return $this->hasMany(Paquete::class);
    }
}