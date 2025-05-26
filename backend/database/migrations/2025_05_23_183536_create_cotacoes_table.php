<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cotacoes', function (Blueprint $table) {
            $table->id();
            $table->string('origem');
            $table->string('destino');
            $table->decimal('preco_km', 8, 2);
            // se quiser já incluir os extras aqui, pode:
            // $table->string('categoria')->nullable();
            // $table->decimal('distancia_km', 8, 2)->nullable();
            // $table->decimal('valor_total', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cotacoes');
    }
};
