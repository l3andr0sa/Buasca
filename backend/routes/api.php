<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CotacaoController;

// Teste rápido
Route::get('/ping', fn() => response()->json(['pong' => true]));

// Rotas CRUD RESTful para cotação
Route::get   ('/cotacao',       [CotacaoController::class, 'index']);
Route::get   ('/cotacao/{id}',  [CotacaoController::class, 'show']);
Route::post  ('/cotacao',       [CotacaoController::class, 'store']);
Route::put   ('/cotacao/{id}',  [CotacaoController::class, 'update']);
Route::patch ('/cotacao/{id}',  [CotacaoController::class, 'update']);
Route::delete('/cotacao/{id}',  [CotacaoController::class, 'destroy']);
