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
}
