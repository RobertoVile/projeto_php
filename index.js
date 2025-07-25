import MenuScene from './PhaserJS/menu.js'
import JogoCena from './PhaserJS/stage.js'
import RankingScene from './PhaserJS/rankings.js';


let config = {
    type: Phaser.AUTO,
    width:1100,
    height:600,
    parent:'game-container',
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:0},
            debug:false
        }
    
    },
    audio: {
    disableWebAudio: false
  },
    autoFocus: true,
    disableVisibilityChange: true,
    scene:[MenuScene,JogoCena,RankingScene]


};

window.game = new Phaser.Game(config);



