<?php
session_start();

$erros = [];
$sucesso = '';

if (isset($_SESSION['erro_login'])) {
    $erros[] = $_SESSION['erro_login'];
    unset($_SESSION['erro_login']);
}

if (isset($_GET['cadastro']) && $_GET['cadastro'] === 'sucesso') {
    $sucesso = 'Cadastro realizado com sucesso! Faça login.';
}
?>


<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kokushibo jump – Login</title>

  <!-- Bootstrap CSS -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT"
    crossorigin="anonymous"
  >
  <!-- Bootstrap Icons -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css"
    rel="stylesheet"
  >
  <!-- Seu CSS personalizado -->
  <link rel="stylesheet" href="../assets/css/global.css">
</head>

<body class="d-flex align-items-center justify-content-center vh-100">
  <form method="POST" class="login-form bg-light rounded-4 shadow-sm p-4" action="../Controller/UsuarioController.php?action=login">

    <!-- Cabeçalho -->
    <div class="text-center mb-4">
      <div class="bg-black rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
      <i class="bi bi-joystick bg-white fs-1"></i>
      </div>
      <h2 class="h4 text-black fw-bold mb-1">Bem Vindo ao Kokushibo Jump!</h2>
      <p class="text-muted mb-0">Faça seu login</p>


<?php if (!empty($erros)): ?>
  <div class="alert alert-danger">
    <ul class="mb-0">
      <?php foreach ($erros as $erro): ?>
        <li><?= htmlspecialchars($erro) ?></li>
      <?php endforeach ?>
    </ul>
  </div>
<?php endif; ?>


    </div>

    <!-- Email ou Nome de Usuário -->
    <div class="mb-3">
      <label for="userEmailAddress" class="form-label">E‑mail ou Nome de Usuário</label>
      <div class="input-group shadow-sm">
        <span class="input-group-text bg-white border-end-0">
          <i class="bi bi-envelope-fill text-black"></i>
        </span>
        <input
          type="text"
          id="userEmailAddress"
          name="email_e_usuario"
          class="form-control custom-input"
          placeholder="seu@email.com ou seu nome de usuário"
          required
        >
      </div>
    </div>

    <!-- Senha -->
    <div class="mb-4">
      <label for="userPassword" class="form-label">Senha</label>
      <div class="input-group shadow-sm">
        <span class="input-group-text bg-white border-end-0">
          <i class="bi bi-lock-fill text-black"></i>
        </span>
        <input
          type="password"
          id="userPassword"
          name="senha"
          class="form-control custom-input"
          placeholder="Sua senha"
          required
        >
      </div>
    </div>

    <!-- Botão Entrar -->
    <button type="submit" class="btn btn-danger w-100 mb-3">
      Entrar
    </button>

    <!-- Link de Cadastro -->
    <p class="text-center mb-0">
      Não tem uma conta?
      <a href="tela_cadastro.php" class="text-primary fw-bold">
        Cadastre‑se aqui
      </a>
    </p>
  </form>
  </div>
  <!-- Bootstrap JS -->
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO"
    crossorigin="anonymous"
  ></script>
</body>
</html>
