<?php
session_start();
session_unset(); // remove todas as variáveis da sessão
session_destroy(); // destrói a sessão
echo json_encode(['status' => 'deslogado']);
