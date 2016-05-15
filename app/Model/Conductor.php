<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Conductor extends Model
{
    protected $table = 'conductores';

    protected $fillable = ['vehiculo_id', 'identificacion', 'nombres', 'apellidos', 'activo', 'imagen',
        'telefono', 'direccion', 'correo', 'usuario_id', 'central_id', 'estado', 'nlicencia', 'toperacion'];

    protected $casts = ['activo' => 'boolean'];

    public $timestamps = false;

    public function vehiculo(){
        return $this->hasOne(Vehiculo::class);
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class)->select('id', 'nombre');
    }

    public function central()
    {
        return $this->belongsTo(Central::class)->select('id', 'ciudad_id');
    }

    public function incidencias()
    {
        return $this->hasMany(Incidencia::class);
    }

    public function pagosPrestaciones($prestacion_id = null)
    {
        if($prestacion_id){
            return $this->hasMany(PagoPrestacion::class, 'conductor_id', 'id')->where('prestacion_id', '=', $prestacion_id)->get();
        }else {
            return $this->hasMany(PagoPrestacion::class, 'conductor_id', 'id');
        }
    }

    public function pasajerosEnRuta(){
        return $this->hasMany(Pasajero::class)->select('*')->where('estado', 'En ruta');
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

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function viaje()
    {
        return $this->belongsTo(Viaje::class)->where('estado', 'En ruta');
    }
}
