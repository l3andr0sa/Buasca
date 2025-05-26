<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     * Permite CORS em todas as rotas da aplicação.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Se for preflight, retorna só os headers:
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        // Defina aqui as origens que você quer permitir. "*" = qualquer.
        $response->headers->set('Access-Control-Allow-Origin', '*');
        // Quais métodos são permitidos
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        // Quais headers o cliente pode usar
        $response->headers->set(
            'Access-Control-Allow-Headers',
            'Content-Type, Accept, Authorization, X-Requested-With, Application'
        );
        // Opcional: permitir que o front leia este header (caso você envie um custom)
        $response->headers->set('Access-Control-Expose-Headers', 'Authorization');

        return $response;
    }
}
