<?php
namespace Config;

use PDO;
use PDOException;

require_once __DIR__ . '/configuration.php';

class Database {
    public static function connect(): PDO {
        $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8';

        try {
            return new PDO($dsn, DB_USER, DB_PASSWORD, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch (PDOException $e) {
            die("Erro de conexão com o banco de dados: " . $e->getMessage());
        }
    }
}
