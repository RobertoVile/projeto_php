import Controladora_Musica from './sons.js';


class MenuScene extends Phaser.Scene {

    static jaInicializou = false;
    constructor() {
        super('menu');
    }

    preload() {
        this.bar = this.add.graphics();

        this.load.on('progress', p => {
            this.bar.clear();
            this.bar.fillStyle(0xffffff, 1);
            this.bar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * p, 50);
        });

        this.load.spritesheet('fundo', 'assets/img/menu.png', {
            frameWidth: 754,
            frameHeight: 424
        });

        this.load.audio('kaer_mohren', 'assets/sounds/kaer_mohren.mp3');
    }

    create() {
    Controladora_Musica.tocar(this,'kaer_mohren');

    if (this.bar) {
        this.bar.destroy();
    }

    if (!MenuScene.jaInicializou) {
        const textoClique = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Clique para continuar',
            {
                fontSize: '28px',
                color: '#ffffff',
                backgroundColor: '#00000088',
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }

            textoClique.destroy();
            MenuScene.jaInicializou = true; // 👈 Marca como inicializado
            this.iniciarMenu();
        });
    } else {
        this.iniciarMenu(); // 👈 Vai direto pro menu
    }
}


    iniciarMenu() {
        const centro_horizontal = this.cameras.main.centerX;
        const centro_vertical = this.cameras.main.centerY;

        const fundoSprite = this.add.sprite(centro_horizontal, centro_vertical, 'fundo');
        fundoSprite.setOrigin(0.5);
        fundoSprite.setScale(1.5, 1.4);

        this.anims.create({
            key: 'animacaoMenuFundo',
            frames: this.anims.generateFrameNumbers('fundo', { start: 0, end: 179 }),
            frameRate: 50,
            repeat: -1
        });

        fundoSprite.play('animacaoMenuFundo');

        // Função para criar botões arredondados
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

        criarBotao(centro_horizontal, 300, 220, 70, 0x1e90ff, 0x63b8ff, 'Jogar', () => {
            Controladora_Musica.parar(this);
            this.scene.start('JogoCena');
        });

        criarBotao(centro_horizontal, 380, 220, 70, 0x32cd32, 0x7fff7f, 'Rankings', () => {
            this.scene.start('RankingScene');
        });

criarBotao(centro_horizontal - 430, 550, 220, 70,0xff4c4c, 0xcc0000, 'Sair', () => {
    fetch('logout.php', {
        method: 'POST',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'deslogado') {
            // Redireciona para a página de login (PHP)
            window.location.href = 'http://localhost/app/View/tela_login.php';
        }
    })
    .catch(err => console.error('Erro ao sair:', err));
});

        this.add.text(centro_horizontal, 100, 'Kokushibo Jump 2', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
}

export default MenuScene;
