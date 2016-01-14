<?php namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'empresas';

    protected $guarded = ['id'];
    protected $casts = ['estado' => 'boolean'];

    public $timestamps = false;

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'empresa_servicios', 'empresa_id', 'servicio_id');
    }
}