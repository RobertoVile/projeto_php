<?php
namespace Controller;

// Importa as classes necessárias do namespace Model e Config
use Model\Pontuacao;
use Config\Database;

// Inclui o autoload do Composer para carregar as dependências automaticamente
require __DIR__ . '/../vendor/autoload.php';

// Inicia a sessão para gerenciar autenticação e dados do usuário
session_start();

class PontuacaoController
{
    // Propriedade para armazenar o modelo de Pontuação
    private Pontuacao $model;

    // Construtor que cria a conexão com o banco de dados e instancia o modelo
    public function __construct()
    {
        $db = Database::connect();
        $this->model = new Pontuacao($db);
    }

    // Método principal que processa a requisição HTTP
    public function processarRequisicao(): void
    {
        // Permite requisições de qualquer origem (CORS) e define o tipo de conteúdo como JSON
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");

        // Verifica se o usuário está autenticado via sessão
        if (!isset($_SESSION['logado'])) {
            echo json_encode(['erro' => 'Usuário não autenticado']);
            exit;
        }

        // Obtém o método HTTP da requisição
        $metodo = $_SERVER['REQUEST_METHOD'];

        // Decide qual ação tomar com base no método HTTP
        switch ($metodo) {
            case 'POST':
                $this->atualizarPontuacao(); // Atualiza a pontuação do usuário
                break;
            case 'GET':
                $this->listarRanking(); // Lista o ranking dos jogadores
                break;
            default:
                echo json_encode(["erro" => "Método HTTP inválido."]); // Método não suportado
                exit;
        }
    }

    // Método para atualizar a pontuação do usuário logado
    private function atualizarPontuacao(): void
    {
        $usuarioId = $_SESSION['logado'];
        error_log("Atualizando pontuação do usuário ID: " . $usuarioId);

        // Recebe os dados JSON enviados no corpo da requisição
        $dados = json_decode(file_get_contents("php://input"));

        // Verifica se o parâmetro 'pontos' foi enviado
        if (!isset($dados->pontos)) {
            echo json_encode(["erro" => "Dados incompletos."]);
            exit;
        }

        // Chama o método do modelo para atualizar a pontuação no banco
        $ok = $this->model->atualizarPontuacaoPorUsuarioId($usuarioId, $dados->pontos);

        // Retorna a resposta JSON informando sucesso ou erro
        echo json_encode([
            "status" => $ok ? "sucesso" : "erro",
            "mensagem" => $ok ? "Pontuação atualizada com sucesso." : "Erro ao atualizar pontuação."
        ]);
    }

    // Método para listar o ranking dos jogadores
    private function listarRanking(): void
    {
        // Recebe o parâmetro 'limite' da URL para limitar a quantidade de resultados, padrão 10
        $limite = isset($_GET['limite']) ? intval($_GET['limite']) : 10;

        // Chama o modelo para obter os dados do ranking
        $dados = $this->model->listarTopJogadores($limite);

        // Retorna o ranking em formato JSON
        echo json_encode($dados);
    }
}

// Instancia o controlador e processa a requisição recebida
$controller = new PontuacaoController();
$controller->processarRequisicao();
