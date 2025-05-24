<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CotacaoController;

Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});

Route::apiResource('cotacao', CotacaoController::class);
