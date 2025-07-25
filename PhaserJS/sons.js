export default class Controladora_Musica {
    static musica = null;

    static tocar(scene, chaveMusica) {
        if (this.musica) {
            this.musica.stop();
            this.musica = null;
        }
        this.musica = scene.sound.add(chaveMusica, {
            loop: true,
            volume: 0.5
        });
        this.musica.play();
    }

    static parar() {
        if (this.musica) {
            this.musica.stop();
            this.musica = null;
        }
    }

    static pausar() {
        if (this.musica) this.musica.pause();
    }

    static resumir() {
        if (this.musica && this.musica.isPaused) this.musica.resume();
    }
}
