<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'empresas';

    protected $guarded = ['id'];

    protected $casts = ['estado' => 'boolean'];

    public $timestamps = false;

    public function centrales()
    {
        return $this->hasMany(Central::class);
    }

    public function conductores()
    {
        return $this->hasMany(Conductor::class);
    }

    public function vehiculos()
    {
        return $this->hasManyThrough(Vehiculo::class, Conductor::class);
    }

    public function pagosPrestaciones()
    {
        return $this->hasManyThrough(PagoPrestacion::class, Conductor::class);
    }

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'empresa_servicios', 'empresa_id', 'servicio_id');
    }

    public function deducciones()
    {
        return $this->hasMany(Deduccion::class);
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}