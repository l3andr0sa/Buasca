<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adiciona campos extras à tabela cotacoes
     */
    public function up(): void
    {
        Schema::table('cotacoes', function (Blueprint $table) {
            $table->string('categoria')->nullable()->after('preco_km');
            $table->string('cidade')->nullable()->after('categoria');
            $table->decimal('preco_total', 10, 2)->nullable()->after('cidade');
            $table->float('distancia_km')->nullable()->after('preco_total');
            // Adicione mais campos se desejar
        });
    }

    /**
     * Remove campos extras se fizer rollback
     */
    public function down(): void
    {
        Schema::table('cotacoes', function (Blueprint $table) {
            $table->dropColumn(['categoria', 'cidade', 'preco_total', 'distancia_km']);
        });
    }
};
