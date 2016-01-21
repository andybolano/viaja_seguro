<?php namespace App\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Usuario extends Authenticatable
{
    protected $table = 'usuarios';

    protected $fillable = ['email', 'password', 'rol_id'];

    protected $hidden = ['password'];

    public function rol()
    {
        return $this->belongsTo(Rol::class);
    }

    public static function nuevo($nombre, $contrasena, $id_rol)
    {
       return parent::create([
           'email' => $nombre,
           'password' => password_hash($contrasena, PASSWORD_DEFAULT),
           'estado' => -1,
           'rol_id' => $id_rol
       ]);
    }
}
