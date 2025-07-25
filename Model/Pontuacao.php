<?php
namespace Model;

use PDO;

class Pontuacao
{
    private PDO $db;

    public function __construct(PDO $conexao)
    {
        $this->db = $conexao;
    }

    public function atualizarPontuacaoPorUsuarioId(int $usuarioId, int $pontos): bool
    {
        $stmt = $this->db->prepare("UPDATE usuario SET pontuacao = pontuacao + :pontos WHERE id = :id");
        return $stmt->execute([
            ':id' => $usuarioId,
            ':pontos' => $pontos
        ]);
    }

    public function listarTopJogadores(int $limite = 10): array
    {
        $sql = "SELECT user_name, pontuacao FROM usuario ORDER BY pontuacao DESC LIMIT :limite";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
