<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CotacaoController;

// Rota de teste simples: GET /api/ping
Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});

// Rotas CRUD para /api/cotacao
Route::get   ('/cotacao',       [CotacaoController::class, 'index']);
Route::get   ('/cotacao/{id}',  [CotacaoController::class, 'show']);
Route::post  ('/cotacao',       [CotacaoController::class, 'store']);
Route::put   ('/cotacao/{id}',  [CotacaoController::class, 'update']);
Route::patch ('/cotacao/{id}',  [CotacaoController::class, 'update']);
Route::delete('/cotacao/{id}',  [CotacaoController::class, 'destroy']);
