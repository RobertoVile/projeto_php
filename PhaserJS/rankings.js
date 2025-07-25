class RankingScene extends Phaser.Scene {
    constructor() {
        super('RankingScene');
    }

    preload() {
        // === BARRA DE CARREGAMENTO ===
        this.bar = this.add.graphics();

        this.load.on('progress', p => {
            this.bar.clear();
            this.bar.fillStyle(0xffffff, 1);
            this.bar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * p, 50);
        });

        // === FUNDO DO MENU (SPRITESHEET ANIMADA) ===
        this.load.spritesheet('fundo', 'assets/img/menu.png', {
            frameWidth: 754,
            frameHeight: 424
        });
    }

    create() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        // === FUNDO ANIMADO IGUAL AO MENU ===
        const fundoSprite = this.add.sprite(cx, cy, 'fundo');
        fundoSprite.setOrigin(0.5);
        fundoSprite.setScale(1.5, 1.4);

        this.anims.create({
            key: 'animacaoMenuFundo',
            frames: this.anims.generateFrameNumbers('fundo', { start: 0, end: 179 }),
            frameRate: 50,
            repeat: -1
        });

        fundoSprite.play('animacaoMenuFundo');

        // === FUNÇÃO UTILITÁRIA PARA CRIAR BOTÕES ===
        const criarBotao = (x, y, largura, altura, cor, corHover, texto, callback) => {
            const container = this.add.container(x, y);

            const graphics = this.add.graphics();
            graphics.fillStyle(cor, 1);
            graphics.lineStyle(3, 0xffffff, 1);
            graphics.fillRoundedRect(-largura / 2, -altura / 2, largura, altura, 15);
            graphics.strokeRoundedRect(-largura / 2, -altura / 2, largura, altura, 15);

            graphics.setInteractive(new Phaser.Geom.Rectangle(-largura / 2, -altura / 2, largura, altura), Phaser.Geom.Rectangle.Contains);
            graphics.on('pointerover', () => {
                graphics.clear();
                graphics.fillStyle(corHover, 1);
                graphics.lineStyle(3, 0xffffff, 1);
                graphics.fillRoundedRect(-largura / 2, -altura / 2, largura, altura, 15);
                graphics.strokeRoundedRect(-largura / 2, -altura / 2, largura, altura, 15);
                this.input.manager.canvas.style.cursor = 'pointer';
            });
            graphics.on('pointerout', () => {
                graphics.clear();
                graphics.fillStyle(cor, 1);
                graphics.lineStyle(3, 0xffffff, 1);
                graphics.fillRoundedRect(-largura / 2, -altura / 2, largura, altura, 15);
                graphics.strokeRoundedRect(-largura / 2, -altura / 2, largura, altura, 15);
                this.input.manager.canvas.style.cursor = 'default';
            });
            graphics.on('pointerdown', callback);

            const textoBotao = this.add.text(0, 0, texto, {
                fontSize: '28px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            container.add([graphics, textoBotao]);
            container.setSize(largura, altura);
            container.setInteractive();

            return container;
        };

        // === TÍTULO DA TELA ===
        criarBotao(cx, 80, 400, 60, 0x1e90ff, 0x63b8ff, 'Ranking de Pontuação', () => {}).disableInteractive();

        // === FUNDO DECORATIVO DA BORDA DO RANKING ===
        const larguraBorda = 500;
        const alturaBorda = 300;
        const posXBorda = cx - larguraBorda / 2;
        const posYBorda = 170;

        const borda = this.add.graphics();
        borda.fillStyle(0x000000, 0.6);
        borda.fillRoundedRect(posXBorda, posYBorda, larguraBorda, alturaBorda, 20);
        borda.lineStyle(4, 0xffffff, 1);
        borda.strokeRoundedRect(posXBorda, posYBorda, larguraBorda, alturaBorda, 20);

        // === TEXTO DO RANKING ===
        this.textoRanking = this.add.text(cx, 320, 'Carregando...', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 460, useAdvancedWrap: true }
        }).setOrigin(0.5);

        // === BOTÃO VOLTAR AO MENU ===
        criarBotao(cx, this.cameras.main.height - 50, 220, 70, 0x32cd32, 0x7fff7f, 'Voltar ao Menu', () => {
            this.scene.start('menu');
        });

        // === REQUISIÇÃO PARA OBTER O RANKING ===
        this.carregarRanking();
    }

    // === FUNÇÃO PARA CARREGAR O RANKING DE PONTUAÇÃO ===
    carregarRanking() {
        fetch('http://localhost/app/Controller/PontuacaoController.php?limite=10')
            .then(res => res.json())
            .then(data => {
                if (data.erro) {
                    this.textoRanking.setText('Erro: ' + data.erro);
                    return;
                }

                let texto = '';
                data.forEach((item, index) => {
                    texto += `${index + 1}. ${item.user_name} — ${item.pontuacao}\n`;
                });

                this.textoRanking.setText(texto);
            })
            .catch(err => {
                this.textoRanking.setText('Erro ao carregar ranking.');
                console.error(err);
            });
    }
}

export default RankingScene;
