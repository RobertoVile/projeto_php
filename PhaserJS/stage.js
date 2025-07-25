import Controladora_Musica from './sons.js';

// === CENA PRINCIPAL DO JOGO ===
class JogoCena extends Phaser.Scene {
    constructor() {
        super('JogoCena');
        
    }

    // === FUNÇÕES DE CARREGAMENTO ===
    preload() {
       
        this.bar = this.add.graphics();
        const { width, height } = this.scale;

        this.load.on('progress', (p) => {
            this.bar.clear();
            this.bar.fillStyle(0xffffff, 1);
            this.bar.fillRect(0, height / 2 - 25, width * p, 50);
        });

        this.load.on('complete', () => {
            this.bar.destroy();
        });

        this.load.spritesheet('kokushibo_estatico', 'assets/img/kokushibo_estatico.png', { frameWidth: 30, frameHeight: 53 });
        this.load.spritesheet('kokushibo_correndo', 'assets/img/kokushibo_correndo.png', { frameWidth: 47, frameHeight: 48 });
        this.load.spritesheet('kokushibo_pulando', 'assets/img/kokushibo_pulando.png', { frameWidth: 48, frameHeight: 46 });
        this.load.spritesheet('kokushibo_atacando', 'assets/img/kokushibo_atacando.png', { frameWidth: 111, frameHeight: 148 });
        this.load.spritesheet('esqueleto_andando', 'assets/img/spritesheets/esqueleto_do_mal/esqueleto_do_mal_andando.png', { frameWidth: 149, frameHeight: 140 });

        this.load.image('kokushibo_morrendo', 'assets/img/kokushibo_morto.png');
        this.load.audio('estagio_musica', 'assets/sounds/musica_stage.mp3');
        this.load.image('fundo_estagio', 'assets/img/fundo_estagio.jpg');

        //this.load.audio('morte_inimigo_som', 'assse')
    }


    // === FUNÇÕES DE PAUSA/RESUME ===
    pausarJogo() {
     
        this.estaPausado = true;
        this.physics.world.pause();
        this.time.paused = true;

        const { width, height } = this.scale;

        this.pauseBg = this.add.graphics();
        this.pauseBg.fillStyle(0x000000, 0.6);
        this.pauseBg.fillRoundedRect(width / 2 - 160, height / 2 - 100, 320, 180, 20);
        this.pauseBg.lineStyle(4, 0xffffff, 1);
        this.pauseBg.strokeRoundedRect(width / 2 - 160, height / 2 - 100, 320, 180, 20);

        const centerX = width / 2;
        const centerY = height / 2;

        this.textoPausado
            .setPosition(centerX, centerY - 50)
            .setVisible(true);

        this.opcaoContinuar
            .setVisible(true);

        this.opcaoMenu
            .setVisible(true);

        Controladora_Musica.pausar(this, 'estagio_musica');

        this.children.bringToTop(this.textoPausado);
        this.children.bringToTop(this.opcaoContinuar);
        this.children.bringToTop(this.opcaoMenu);

    }


    iniciarContagem() {
        // Não alterado
        if (this.pauseBg) {
            this.pauseBg.destroy();
        }

        this.time.paused = false;
        this.emContagem = true;
        this.textoPausado.setVisible(false);
        this.opcaoContinuar.setVisible(false);
        this.opcaoMenu.setVisible(false);

        this.textoContador
            .setStyle({ fontSize: '48px', color: '#ff0000', fontFamily: 'monospace', fontStyle: 'bold' })
            .setVisible(true);

        const numeros = ['3', '2', '1', 'COMEÇAR!'];
        let indice = 0;

        const proximo = () => {
            const valor = numeros[indice];
            this.textoContador.setText(valor);

            if (valor === 'COMEÇAR!') {
                this.textoContador.setStyle({ fontSize: '96px', color: '#ff0000', fontStyle: 'bold', fontFamily: 'monospace' });
                this.tweens.add({
                    targets: this.textoContador,
                    scale: { from: 0.2, to: 1.2 },
                    alpha: { from: 0, to: 1 },
                    ease: 'Elastic.Out',
                    duration: 1000
                });
            } else {
                this.textoContador.setScale(1);
                this.textoContador.setStyle({ fontSize: '48px', color: '#ff0000', fontStyle: 'bold', fontFamily: 'monospace' });
                this.tweens.add({
                    targets: this.textoContador,
                    scale: { from: 0.8, to: 1 },
                    yoyo: true,
                    ease: 'Sine.easeInOut',
                    duration: 300
                });
            }

            indice++;
            if (indice < numeros.length) {
                this.time.delayedCall(1000, proximo, [], this);
            } else {
                this.textoContador.setVisible(false);
                this.terminarContagem();
            }
        };

        proximo();

        Controladora_Musica.resumir();
        this.eventoPontuacao.paused = true;
    }


    terminarContagem() {
       
        this.emContagem = false;
        this.estaPausado = false;
        this.physics.world.resume();
        this.time.paused = false;
        this.eventoPontuacao.paused = false;

    }

    morrer() {
       
        Controladora_Musica.parar();

        if (this.jaMorreu) return;
        this.jaMorreu = true;

        this.kokushibo.setVelocity(0, 0);
        this.kokushibo.body.enable = false;
        this.kokushibo.anims.stop();
        this.kokushibo.setTexture('kokushibo_morrendo');

        this.tweens.add({
            targets: this.kokushibo,
            y: 565,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                this.kokushibo.setVelocity(0, 0);
                this.kokushibo.body.enable = false;
            }
        });

        if (this.eventoPontuacao) this.eventoPontuacao.paused = true;

        //AQUI É FEITO O FECTH PARA PONTUACAO CONTROLLER PARA ENVIAR OS DADOS VIA POST EM JSON PARA SEREM ADICIONADOS AO BANCO DE DADOS PHP

        fetch('http://localhost/app/Controller/PontuacaoController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pontos: this.pontuacao })
        })
            .then(res => res.json())
            .then(data => console.log('Resposta do servidor:', data))
            .catch(err => console.error('Erro ao enviar pontuação:', err));

        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.fundoMorte = this.add.graphics();
        this.fundoMorte.fillStyle(0x000000, 0.6);
        this.fundoMorte.fillRoundedRect(cx - 160, cy - 130, 320, 260, 20);
        this.fundoMorte.lineStyle(4, 0xffffff, 1);
        this.fundoMorte.strokeRoundedRect(cx - 160, cy - 130, 320, 260, 20);

        this.textoGameOver = this.add.text(cx, cy - 100, 'VOCÊ PERDEU', {
            fontSize: '32px',
            color: '#ff0000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.textoFinal = this.add.text(cx, cy - 40, 'Pontuação: ' + this.pontuacao, {
            fontSize: '32px',
            color: '#90ee90',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        const estiloBotao = {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: 'Arial'
        };

        this.botaoReiniciar = this.add.text(cx, cy + 40, 'Jogar novamente', estiloBotao)
            .setOrigin(0.5)
            .setInteractive();

        this.botaoMenu = this.add.text(cx, cy + 90, 'Menu principal', estiloBotao)
            .setOrigin(0.5)
            .setInteractive();

        this.botaoReiniciar.on('pointerdown', () => this.scene.restart());
        this.botaoMenu.on('pointerdown', () => this.scene.start('menu'));
    }



    // === CRIAÇÃO DA CENA ===
    create() {
      
        Controladora_Musica.tocar(this, 'estagio_musica');
        this.physics.world.setBoundsCollision(true, true, true, true);

        this.jaMorreu = false;
        this.estaPausado = false;
        this.emContagem = false;
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;
        const fundoSprite = this.add.sprite(cx, cy, 'fundo_estagio');
        fundoSprite.setOrigin(0.5);
        fundoSprite.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        this.physics.world.gravity.y = 800;

      
      
        this.limitePuloY = 30;
      

        this.tempoMaximoSegurarPulo = 300;
        this.horaInicioPulo = 0;

        this.pontuacao = 0;

        this.textoPontuacao = this.add.text(this.cameras.main.width - 20, 20, 'Pontos: 0', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(1, 0).setScrollFactor(0);

        this.eventoPontuacao = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (!this.jaMorreu) {
                    this.pontuacao++;
                    this.textoPontuacao.setText('Pontos: ' + this.pontuacao);
                }
            }
        });

        // --- INÍCIO DAS MUDANÇAS PARA O PULO ---
        this.input.keyboard.on('keydown-W', () => {
            if (this.jaMorreu || this.emContagem) return; 
           
            if (this.kokushibo.body.blocked.down && !this.kokushibo.emAtaque) {
                this.horaInicioPulo = this.time.now;
                this.kokushibo.body.height = 110;
                this.kokushibo.body.width = 70;

                const esq = this.teclas.esquerda.isDown;
                const dir = this.teclas.direita.isDown;
                const velX = esq ? -300 : dir ? 300 : 0;

                this.kokushibo.setVelocityY(-900)
                    .setVelocityX(velX)
                    .setFlipX(esq)
                    .play('animacaoKokushiboPulando', true);
            }
        });
        this.input.keyboard.on('keyup-W', () => {
            if (this.emContagem) return; 
          
            if (!this.kokushibo.body.blocked.down && this.kokushibo.body.velocity.y < 0 && this.kokushibo.y > this.limitePuloY) {
                const duracao = this.time.now - this.horaInicioPulo;
                const fator = Phaser.Math.Clamp(duracao / this.tempoMaximoSegurarPulo, 0, 1);
                this.kokushibo.setVelocityY(-900 * fator);
            }
        });
        // --- FIM DAS MUDANÇAS PARA O PULO ---

        this.anims.create({ key: 'animacaoKokushiboEstatica', frames: this.anims.generateFrameNumbers('kokushibo_estatico', { start: 0, end: 3 }), frameRate: 5.7, repeat: -1 });
        this.anims.create({ key: 'animacaoKokushiboCorrendo', frames: this.anims.generateFrameNumbers('kokushibo_correndo', { start: 0, end: 6 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'animacaoKokushiboPulando', frames: this.anims.generateFrameNumbers('kokushibo_pulando', { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'animacaoKokushiboAtacando', frames: this.anims.generateFrameNumbers('kokushibo_atacando', { start: 0, end: 5 }), frameRate: 15, repeat: 0 });
        this.anims.create({ key: 'esqueleto_do_mal_andando', frames: this.anims.generateFrameNumbers('esqueleto_andando', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });

        this.kokushibo = this.physics.add.sprite(cx, this.physics.world.bounds.height - 120 / 2, 'kokushibo_estatico')
            .setOrigin(0.5)
            .setCollideWorldBounds(true)
            .setDisplaySize(70, 120)
            .play('animacaoKokushiboEstatica');
        this.kokushibo.estaNoAr = false;
        this.kokushibo.emAtaque = false;

        this.teclas = this.input.keyboard.addKeys({ cima: 'W', esquerda: 'A', direita: 'D', ataque: 'J' });

        this.proximoTempoSpawn = 0;
        this.inimigos = this.physics.add.group();

        this.textoPausado = this.add.text(cx, cy - 80, 'PAUSADO', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5).setVisible(false);
        this.opcaoContinuar = this.add.text(cx, cy, 'Retomar', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setInteractive().setVisible(false);
        this.opcaoMenu = this.add.text(cx, cy + 50, 'Menu Principal', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setInteractive().setVisible(false);
        this.textoContador = this.add.text(cx, cy, '', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5).setVisible(false);
        this.iniciarContagem()
        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.estaPausado && !this.emContagem) this.pausarJogo();
        });
        this.opcaoContinuar.on('pointerdown', () => { if (this.estaPausado) this.iniciarContagem(); });
        this.opcaoMenu.on('pointerdown', () => { if (this.estaPausado) this.scene.start('menu'); });

        this.input.keyboard.on('keydown-J', () => {
            if (this.jaMorreu || this.emContagem) return; 
            if (!this.kokushibo.emAtaque) {
                this.kokushibo.velocidadeAntesDoAtaque = this.kokushibo.body.blocked.down ? 0 : this.kokushibo.body.velocity.x;
                this.kokushibo.emAtaque = true;
                this.kokushibo.setVelocityX(0);
                this.kokushibo.body.height = 135;
                this.kokushibo.body.width = 130;
                const offsetX = this.kokushibo.flipX ? 0 : 60;
                this.kokushibo.body.setOffset(offsetX, 40);
                this.kokushibo.play('animacaoKokushiboAtacando');
            }
        });

        this.kokushibo.on('animationupdate', (anim) => {
            if (anim.key === 'animacaoKokushiboAtacando') {
                const offsetX = this.kokushibo.flipX ? 0 : 60;
                this.kokushibo.body.setOffset(offsetX, 40);
            }
        });

        this.kokushibo.on('animationcomplete-animacaoKokushiboAtacando', () => {
            this.kokushibo.emAtaque = false;
            if (!this.kokushibo.body.blocked.down) {
                this.kokushibo.setVelocityX(this.kokushibo.velocidadeAntesDoAtaque);
            }
        });

        this.physics.add.overlap(this.kokushibo, this.inimigos, (player, inimigo) => {
            if (!player.emAtaque) {
                this.morrer();
                return;
            } else {
                inimigo.destroy();
                this.pontuacao += 100;
                this.textoPontuacao.setText('Pontos: ' + this.pontuacao);
            }
        });

        this.eventoPontuacao = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (!this.jaMorreu && !this.emContagem) {
                    this.pontuacao++;
                    this.textoPontuacao.setText('Pontos: ' + this.pontuacao);
                }
            }
        });
        this.eventoPontuacao.paused = true;
    }

    update(tempo) {
        
        if (this.jaMorreu) {
            return;
        }
  
        if (this.estaPausado || this.emContagem || this.physics.world.isPaused) {
           
            if (this.emContagem) {
                this.kokushibo.setVelocityX(0);
               
                if (this.kokushibo.anims.currentAnim.key !== 'animacaoKokushiboEstatica') {
                    this.kokushibo.play('animacaoKokushiboEstatica', true);
                    this.kokushibo.setOffset(0, 0);
                    this.kokushibo.body.height = 120;
                    this.kokushibo.body.width = 70;
                }
            }
            return;
        }


        // ---Controle de limite de pulo no eixo Y ---
       
        if (this.kokushibo.y < this.limitePuloY && this.kokushibo.body.velocity.y < 0) {
            this.kokushibo.setVelocityY(0); 
            this.kokushibo.y = this.limitePuloY; 
        }
        // --- FIM DA ADIÇÃO ---

        const velocidadeX = 400;
        const velocidadePuloX = 300;
        const tocandoChao = this.kokushibo.body.blocked.down;
        const esq = this.teclas.esquerda.isDown;
        const dir = this.teclas.direita.isDown;

        if (this.kokushibo.emAtaque) {
            if (tocandoChao) this.kokushibo.setVelocityX(0);
            else this.kokushibo.setVelocityX(this.kokushibo.velocidadeAntesDoAtaque);
        } else {
            if (tocandoChao) {
                this.kokushibo.setVelocityX(0);
                if (esq) {
                    this.kokushibo.setVelocityX(-velocidadeX).setFlipX(true).play('animacaoKokushiboCorrendo', true);
                    this.kokushibo.setOffset(0, 0);
                    this.kokushibo.body.height = 113;
                    this.kokushibo.body.width = 75;
                }
                else if (dir) {
                    this.kokushibo.setVelocityX(velocidadeX).setFlipX(false).play('animacaoKokushiboCorrendo', true);
                    this.kokushibo.setOffset(0, 0);
                    this.kokushibo.body.height = 113;
                    this.kokushibo.body.width = 75;
                }
                else {
                    this.kokushibo.play('animacaoKokushiboEstatica', true);
                    this.kokushibo.setOffset(0, 0);
                    this.kokushibo.body.height = 120;
                    this.kokushibo.body.width = 70;
                }
            } else {
                this.kokushibo.setVelocityX(esq ? -velocidadePuloX : dir ? velocidadePuloX : 0).setFlipX(esq);
            }
        }


        this.inimigos.getChildren().forEach(inimigo => {
            if (!inimigo.active) return;

            const direcao = this.kokushibo.x > inimigo.x ? 1 : -1;
            const velocidade = inimigo.relampago ? 900 : 600;

            inimigo.setVelocityX(direcao * velocidade);
            inimigo.setFlipX(direcao < 0);
        });

        if (tempo > this.proximoTempoSpawn) {
            this.esqueletoDoMal();
            this.proximoTempoSpawn = tempo + Phaser.Math.Between(0, 5000);
        }
    }

    //FUNÇÃO DO ESQUELETO DO MAL
    esqueletoDoMal() {
       
        const cam = this.cameras.main;
        const off = 50;
        const l = Phaser.Math.Between(0, 1);
        const x = l === 0 ? -off : cam.width + off;
        const y = this.physics.world.bounds.height;

        const isRelampago = Phaser.Math.FloatBetween(0, 1) < 0.7;

        const inimigo = this.inimigos.create(x, y, 'esqueleto_andando')
            .setOrigin(l === 0 ? 0 : 1, 1)
            .setScale(1.8);

        inimigo.body.setSize(50, 70);
        inimigo.body.allowGravity = true;
        inimigo.setCollideWorldBounds(true);
        inimigo.relampago = isRelampago;

        inimigo.play('esqueleto_do_mal_andando');

        if (isRelampago) {
            inimigo.setTint(0xff0000);
        } else {
            inimigo.clearTint();
        }
    }
}

export default JogoCena;