<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cotacao extends Model
{
    protected $fillable = [
        'origem',
        'destino',
        'categoria',
        'cidade',
        'distancia',
        'preco',
    ];
}
