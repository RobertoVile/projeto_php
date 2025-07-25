O banco de dados deve se chamar kokushibo_jump e a porta que está rodando o banco deverá ser: 3306


A estrutura do banco deverá ser:

CREATE TABLE `usuario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(100) COLLATE utf8mb4_general_ci NOT NULL UNIQUE,
  `email` VARCHAR(150) COLLATE utf8mb4_general_ci NOT NULL UNIQUE,
  `senha` VARCHAR(255) COLLATE utf8mb4_general_ci NOT NULL,
  `pontuacao` INT(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
