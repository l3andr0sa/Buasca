<?php
/**
 * public/index.php
 * 
 * Ponto de entrada principal para todas as requisições HTTP.
 * Aqui injetamos os cabeçalhos CORS logo no início.
 */

// ------------ Cabeçalhos CORS globais -------------
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');

// Se for preflight request, responde imediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
// --------------------------------------------------

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer fornece o autoloader para todas as classes utilizadas na aplicação
| (framework, pacotes e seu próprio código). Vamos carregá-lo aqui.
|
*/

require __DIR__ . '/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Turn On The Lights
|--------------------------------------------------------------------------
|
| Inicializa a aplicação Laravel através do arquivo bootstrap/app.php,
| que retorna a instância principal do container / kernel HTTP.
|
*/

$app = require_once __DIR__ . '/../bootstrap/app.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Captura a requisição HTTP atual, envia-a ao kernel do Laravel e exibe
| a resposta gerada de volta ao cliente. Por fim, chama terminate() para
| que quaisquer eventuais tarefas de shutdown sejam executadas.
|
*/

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request  = Illuminate\Http\Request::capture();
$response = $kernel->handle($request);

$response->send();

$kernel->terminate($request, $response);
