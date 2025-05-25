<?php

namespace App\Http\Controllers;

use App\Models\Cotacao;
use Illuminate\Http\Request;

class CotacaoController extends Controller
{
    /**
     * Listar todas as cotações
     */
    public function index()
    {
        return response()->json(Cotacao::all());
    }

    /**
     * Buscar uma cotação por ID
     */
    public function show($id)
    {
        $cotacao = Cotacao::find($id);

        if (!$cotacao) {
            return response()->json(['mensagem' => 'Cotação não encontrada'], 404);
        }

        return response()->json($cotacao);
    }

    /**
     * Criar uma nova cotação
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'origem'   => 'required|string|max:255',
            'destino'  => 'required|string|max:255',
            'preco_km' => 'required|numeric|min:0',
        ]);

        $cotacao = Cotacao::create($data);

        return response()->json($cotacao, 201);
    }

    /**
     * Atualizar uma cotação existente
     */
    public function update(Request $request, $id)
    {
        $cotacao = Cotacao::find($id);

        if (!$cotacao) {
            return response()->json(['mensagem' => 'Cotação não encontrada'], 404);
        }

        $data = $request->validate([
            'origem'   => 'sometimes|required|string|max:255',
            'destino'  => 'sometimes|required|string|max:255',
            'preco_km' => 'sometimes|required|numeric|min:0',
        ]);

        $cotacao->update($data);

        return response()->json($cotacao);
    }

    /**
     * Deletar uma cotação
     */
    public function destroy($id)
    {
        $cotacao = Cotacao::find($id);

        if (!$cotacao) {
            return response()->json(['mensagem' => 'Cotação não encontrada'], 404);
        }

        $cotacao->delete();

        return response()->json(['mensagem' => 'Cotação deletada com sucesso!']);
    }
}
