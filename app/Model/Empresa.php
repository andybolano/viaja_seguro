<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'empresas';

    protected $casts = ['estado' => 'boolean'];

    public $timestamps = false;

    public function centrales()
    {
        return $this->hasMany(Central::class);
    }

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'empresa_servicios', 'empresa_id', 'servicio_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}