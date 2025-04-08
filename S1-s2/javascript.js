class Escena extends Phaser.Scene {
    preload() {
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.spritesheet('bola', 'img/bola.png',{
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.image('mano1', 'img/mano1.png');
    }
    
    create() {
        this.add.sprite(480, 320, 'fondo');
        this.bola = this.physics.add.sprite(480, 320, 'bola');

        this.anims.create({
            key: 'brillar',
            frames: this. anims.generateFrameNumbers ('bola',{
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.bola.play('brillar');

        this.mano1 = this.physics.add.sprite(70,320, 'mano1');

        const velocidad = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzq = Math.floor(Math.random() * 2);
        if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;

        const vx = Math.sin(anguloInicial)*velocidad;
        const vy = Math.cos(anguloInicial)*velocidad;
        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
        
        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        this.bola.rotation +=0.1;

        if (this.bola.x > config.width || this.bola.x < 0) {
            this. bola. body. velocity.x = -this.bola.body. velocity.x;
        }
        if (this.bola.y > config.height || this.bola.y < 0) {
        this.bola.body.velocity.y = -this.bola.body. velocity.y;
        }

        if (this.cursors.up.isDown) {
            this.mano1.y = this.mano1.y - 5;
        } else if (this.cursors.down. isDown) {
            this.mano1.y = this.mano1.y + 5;
        }
    }
}
    
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: Escena,
    physics: {
        default: 'arcade',
    },
};

new Phaser.Game(config);

