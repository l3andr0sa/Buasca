<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cotacoes', function (Blueprint $table) {
            $table->string('categoria')->nullable()->after('preco_km');
            $table->decimal('distancia_km', 8, 2)->nullable()->after('categoria');
            $table->decimal('valor_total', 10, 2)->nullable()->after('distancia_km');
        });
    }

    public function down(): void
    {
        Schema::table('cotacoes', function (Blueprint $table) {
            $table->dropColumn(['categoria', 'distancia_km', 'valor_total']);
        });
    }
};
