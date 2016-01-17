<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Documentacion extends Model
{
    protected $table = 'documentacion';

    public $timestamps = false;

    protected $fillable = ['nombre'];
}