<?php
session_start();

if(empty($_SESSION['logado'])){
  header('Location: View/tela_login.php');
  exit;
}

?>


<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kokushibo Jump</title>

    <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
  <link rel="stylesheet" href="assets/css/global.css">
  <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js"></script>
  <script type="module" src="index.js"></script>
</head>

<body class="d-flex justify-content-center align-items-center min-vh-100">
  <div id="game-container">

  </div>
</body>
</html>
