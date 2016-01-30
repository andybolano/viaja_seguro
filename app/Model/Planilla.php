<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Planilla extends Model
{
    protected $table = 'planilla';

    protected $fillable = ['id', 'numero_planilla'];

    public $timestamps = false;
}