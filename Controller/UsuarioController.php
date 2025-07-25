<?php

// Importa a classe Database para conexão e os arquivos do modelo e configuração do banco
use Config\Database;
require_once __DIR__ . '/../Model/Usuario.php';
require_once __DIR__ . '/../Config/database.php';

// Inicia a sessão para gerenciar dados de usuário e erros
session_start();

// Cria conexão com o banco de dados e instancia o modelo Usuario
$db = Database::connect();
$model = new Usuario($db);

// Captura a ação enviada via GET, se existir
$action = $_GET['action'] ?? '';

// Define o fluxo conforme a ação
switch ($action) {
    case 'cadastro':
        // Recebe os dados enviados pelo formulário de cadastro
        $nome_usuario = $_POST['user_name'] ?? '';
        $email        = $_POST['email'] ?? '';
        $senha        = $_POST['senha'] ?? '';
        $confirmar    = $_POST['confirmar_senha'] ?? '';

        // Valida se todos os campos foram preenchidos
        if (!$nome_usuario || !$email || !$senha || !$confirmar) {
            $_SESSION['erros_cadastro'] = ['Preencha todos os campos.'];
        } 
        // Verifica se as senhas coincidem
        elseif ($senha !== $confirmar) {
            $_SESSION['erros_cadastro'] = ['As senhas não coincidem.'];
        } 
        // Verifica se o e-mail já está cadastrado
        elseif ($model->BuscarEmail($email)) {
            $_SESSION['erros_cadastro'] = ['E‑mail já cadastrado.'];
        } 
        // Verifica se o nome de usuário já existe
        elseif ($model->BuscarUsuario($nome_usuario)) {
            $_SESSION['erros_cadastro'] = ['Usuário já cadastrado.'];
        } else {
            // Tenta criar o usuário no banco
            if ($model->criarUsuario($nome_usuario, $email, $senha)) {
                // Redireciona para a tela de login com sucesso
                header('Location: ../View/tela_login.php?cadastro=sucesso');
                exit;
            }
            // Caso falhe, seta erro genérico
            $_SESSION['erros_cadastro'] = ['Erro ao cadastrar.'];
        }

        // Armazena os dados antigos para repopular o formulário
        $_SESSION['old'] = $_POST;
        // Redireciona para a tela de cadastro para mostrar mensagens
        header('Location: ../View/tela_cadastro.php');
        exit;

    case 'login':
        // Recebe os dados enviados pelo formulário de login
        $email_e_usuario = $_POST['email_e_usuario'] ?? '';
        $senha = $_POST['senha'] ?? '';

        // Valida se todos os campos foram preenchidos
        if (!$email_e_usuario || !$senha) {
            $_SESSION['erro_login'] = "Preencha todos os campos.";
            header('Location: ../View/tela_login.php');
            exit;
        }

        // Tenta buscar o usuário pelo email ou nome para login
        $usuario = $model->fazerLogin($email_e_usuario, $senha);

        // Se não encontrou usuário, seta erro
        if (!$usuario) {
            $_SESSION['erro_login'] = "Credenciais inválidas.";
            header('Location: ../View/tela_login.php');
            exit;
        }

        // Verifica se a senha fornecida corresponde à senha criptografada do banco
        if (!password_verify($senha, $usuario['senha'])) {
            $_SESSION['erro_login'] = "Credenciais inválidas.";
            header('Location: ../View/tela_login.php');
            exit;
        }

        // Autentica o usuário armazenando dados na sessão
        $_SESSION['logado'] = $usuario['id'];          // ID do usuário para controle
        $_SESSION['user_name'] = $usuario['user_name']; // Nome do usuário para exibição

        // Redireciona para a página principal/dashboard após login
        header('Location: ../index.php');
        exit;

    default:
        // Caso não tenha ação válida, redireciona para a tela de login
        header('Location: ../View/tela_login.php');
        exit;
}
