<?php
Class Usuario{
private $pdo;

public function __construct($db) {
        $this->pdo = $db;
    }

public function criarUsuario($nome_usuario, $email,$senha){
 $sql = "INSERT INTO usuario (user_name,email,senha) VALUES (:nome_usuario,:email,:senha)";
 $stmt = $this->pdo->prepare($sql);

 return $stmt->execute([
    ':nome_usuario' => $nome_usuario,
    ':email' => $email,
    ':senha' => password_hash($senha, PASSWORD_DEFAULT)
 ]);

}


public function BuscarEmail($email)
    {
        $sql = "SELECT * FROM usuario WHERE email = :email LIMIT 1";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':email' => $email]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

public function BuscarUsuario($nome_usuario){
    $sql = "SELECT * FROM usuario WHERE user_name = :nome_usuario LIMIT 1";
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute([':nome_usuario' => $nome_usuario]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}


public function fazerLogin($usuario_ou_email,$senha_digitada){
 $sql = "SELECT * FROM usuario WHERE user_name = :credencial OR email = :credencial LIMIT 1";
 $stmt = $this->pdo->prepare($sql);
 $stmt ->execute([':credencial'=> $usuario_ou_email]);

 $usuario =  $stmt->fetch(PDO::FETCH_ASSOC);
 
 if($usuario && password_verify($senha_digitada,$usuario['senha'])){
    return $usuario;
 }


 return false;

}
}




?>
