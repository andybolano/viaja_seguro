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
        return $this->belongsTo(Municipio::class, 'ciudad_id', 'codigo');
    }

    public function ciudaddepa()
    {
        return $this->belongsTo(Municipio::class, 'ciudad_id', 'codigo')->with('departamento');
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
        return $this->hasMany(Pasajero::class)->where('estado', '=', 'En espera');
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

    public function deducciones()
    {
        return $this->belongsToMany(Deduccion::class, 'deducciones_central')->withPivot(
            'valor_lunes',
            'valor_martes',
            'valor_miercoles',
            'valor_jueves',
            'valor_viernes',
            'valor_sabado',
            'valor_domingo'
        );
    }
}
