<?php
session_start();

$erros = [];
$sucesso = '';
$old = [
  'user_name' => '',
  'email' => '',
  'senha' => '',
  'confirmar_senha' => ''
];


if (isset($_SESSION['erros_cadastro']) && is_array($_SESSION['erros_cadastro'])) {
    $erros = $_SESSION['erros_cadastro'];
    unset($_SESSION['erros_cadastro']);
}


if (isset($_SESSION['old'])) {
    $old = $_SESSION['old'];
    unset($_SESSION['old']);
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
  <title>Kokushibo Jump – Cadastro</title>

  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/global.css">
  <link rel="stylesheet" href="../assets/css/tela_cadastro.css">
   <script src="../Config/efeitos_sonoros.js" defer></script>
</head>
<body class="bg-softblue d-flex align-items-center justify-content-center vh-100">

  <div class="card shadow-sm p-4 rounded-4" style="max-width: 500px; width: 100%;">
    <div class="text-center mb-4">
      <div class="bg-circleBlue rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width:64px;height:64px;">
        <i class="bi bi-joystick bg-white fs-1"></i>
      </div>
      <h2 class="h4 text-black fw-bold mb-1">Bem Vindo ao Kokushibo Jump!</h2>
      <p class="text-muted mb-0">Faça seu cadastro</p>
    </div>

<?php if (!empty($erros)): ?>
  <div class="alert alert-danger">
    <ul class="mb-0">
      <?php foreach ($erros as $erro): ?>
        <li><?= htmlspecialchars($erro) ?></li>
      <?php endforeach ?>
    </ul>
  </div>
<?php endif; ?>
    <form method="POST" class="needs-validation login-form bg-light rounded-5 shadow-sm" action="../Controller/UsuarioController.php?action=cadastro" novalidate>
      <div class="mb-2">
        <label for="user_name" class="form-label small">Nome de usuário</label>
        <div class="inner-addon">
          <i class="bi bi-person-circle"></i>
          <input type="text" id="user_name" name="user_name" class="form-control form-control-sm" placeholder="Nome de usuário" required value="<?= htmlspecialchars($old['user_name']) ?>">
        </div>
        <div class="invalid-feedback">Informe seu nome completo.</div>
      </div>

      <div class="mb-2">
        <label for="userEmail" class="form-label small">E‑mail</label>
        <div class="inner-addon">
          <i class="bi bi-envelope-fill"></i>
          <input type="email" id="userEmail" name="email" class="form-control form-control-sm" placeholder="seu@email.com" required value="<?= htmlspecialchars($old['email']) ?>">
        </div>
       
      </div>

      <div class="row g-2 mb-3">
        <div class="col-md-6">
          <label for="userPassword" class="form-label small">Senha</label>
          <div class="inner-addon">
            <i class="bi bi-lock-fill"></i>
            <input type="password" id="userPassword" name="senha" class="form-control form-control-sm" placeholder="Senha" required>
          </div>
          <div class="invalid-feedback">Informe a senha.</div>
        </div>
        <div class="col-md-6">
          <label for="confirmPassword" class="form-label small">Confirmar senha</label>
          <div class="inner-addon">
            <i class="bi bi-lock-fill"></i>
            <input type="password" id="confirmPassword" name="confirmar_senha" class="form-control form-control-sm" placeholder="Confirmar senha" required>
          </div>
        </div>
      </div>

      <div class="d-grid mb-2">
        <button type="submit" class="btn btn-danger btn-sm">Cadastrar</button>
      </div>

      <p class="text-center mb-0">
        Já tem uma conta?
        <a href="tela_login.php" class="text-primary fw-semibold">Faça login aqui</a>
      </p>
    </form>
  </div>

  <!-- Bootstrap JS + validação -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
  <script>
    (() => {
      'use strict';
      const form = document.querySelector('.needs-validation');
      form.addEventListener('submit', e => {
        if (!form.checkValidity()) {
          e.preventDefault();
          form.classList.add('was-validated');
        }
      });
    })();
  </script>
</body>
</html>
