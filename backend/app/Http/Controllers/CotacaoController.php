<?php

namespace App\Http\Controllers;

use App\Models\Cotacao;
use Illuminate\Http\Request;

class CotacaoController extends Controller
{
    private $tarifas = [
        'MUZAMBINHO' => [
            'carro_viagem'  => 2.50,
            'carro_cidade'  => 2.20,
            'carro_black'   => 3.50,
            'carro_central' => 2.70,
            'carro_pet'     => 2.90,
        ],
        'ALTEROSA' => [
            'carro_viagem'  => 2.60,
            'carro_cidade'  => 2.30,
            'carro_black'   => 3.60,
            'carro_central' => 2.80,
            'carro_pet'     => 3.00,
        ],
        // ...adicione as outras cidades
    ];

    public function store(Request $request)
    {
        $data = $request->validate([
            'origem'    => 'required|string|max:255',
            'destino'   => 'required|string|max:255',
            'categoria' => 'required|string',
            'cidade'    => 'required|string',
            'distancia' => 'required|numeric',
        ]);

        $cidade    = strtoupper(trim($data['cidade']));
        $categoria = strtolower(trim($data['categoria']));

        $tarifa = $this->tarifas[$cidade][$categoria] ?? null;
        if (!$tarifa) {
            return response()->json(['erro' => "Tarifa não cadastrada para $cidade/$categoria"], 400);
        }

        $preco = $tarifa * $data['distancia'];

        $cotacao = Cotacao::create([
            'origem'    => $data['origem'],
            'destino'   => $data['destino'],
            'categoria' => $categoria,
            'cidade'    => $cidade,
            'distancia' => $data['distancia'],
            'preco'     => $preco,
        ]);

        return response()->json([
            'cotacao' => $cotacao,
            'preco'   => $preco,
        ], 201);
    }
}
