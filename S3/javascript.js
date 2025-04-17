class Escena extends Phaser.Scene {
    
    preload() {

        this.load.image('fondo', 'img/futboll/estadio.jpg');
        this.load.spritesheet('bola', 'img/futboll/pelota.png', { 
            frameWidth: 790, 
            frameHeight:790 
            
        });
        this.load.image('mano1', 'img/futboll/player.png');
        this.load.image('mano2', 'img/futboll/player.png');
        this.load.image('leftbtn', 'img/flecha.png');

        this.load.audio('musicaFondo', 'Sound/estadio2.mp3');
        this.load.audio('gol', 'Sound/gol.mp3');

    }

    create() {


        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();


        this.add.sprite(480, 320, 'fondo');
        this.bola = this.physics.add.sprite(480, 320, 'bola');
        this.bola.setScale(0.1); 

        

        this.musica = this.sound.add('musicaFondo', {
          loop: true,
            volume: 0.5
        });
        this.musica.play();

        
        
        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.bola.play('brillar');

     
        this.mano1 = this.physics.add.sprite(70, 320, 'mano1');
        this.mano1.setScale(0.2); 

        this.mano1.body.immovable = true;
        this.mano1.setCollideWorldBounds(true);


        this.mano1.body.setSize(300, 1000, true); 

        this.physics.add.collider(this.bola, this.mano1);


        this.mano2 = this.physics.add.sprite(882, 320, 'mano2');
        this.mano2.setScale(0.2); 

        this.mano2.body.immovable = true;
        this.mano2.setCollideWorldBounds(true);


        this.mano2.body.setSize(300, 1000, true); 

        this.physics.add.collider(this.bola, this.mano2);


        const velocidad = 500;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        const derechaOIzquierda = Math.floor(Math.random() * 2);
        if (derechaOIzquierda === 1) anguloInicial += Math.PI;
        
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);

        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        this.cursors = this.input.keyboard.createCursorKeys();


        this.controlesVisuales({ x: 50, y: 50 }, { x: 50, y: 590 }, this.mano1);
        this.controlesVisuales({ x: 910, y: 50 }, { x: 910, y: 590 }, this.mano2);

        this.alguienGano = false;
        this.pintarMarcador();

        this.sonidoGol = this.sound.add('gol', {
            volume: 0.5
        });
        
    }

    update() {

        this.bola.rotation += 0.01;


        if (this.bola.x < 0 && !this.alguienGano) {
            this.sonidoGol.play();
            alert('Jugador 2 ha ganado!');
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.colocarBola();
        } else if (this.bola.x > 960 && !this.alguienGano) {
            this.sonidoGol.play();
            alert('Jugador 1 ha ganado!');
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.colocarBola();
        }
        
        if (this.cursors.up.isDown || this.mano1.getData('direccionVertical') === 1) {
            this.mano1.y -= 5;
        } else if (this.cursors.down.isDown || this.mano1.getData('direccionVertical') === -1) {
            this.mano1.y += 5;
        }


        if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1) {
            this.mano2.y -= 5;
        } else if (this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1) {
            this.mano2.y += 5;
        }
    }

    pintarMarcador() {
        this.marcadorMano1 = this.add.text(440, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff',
        }).setOrigin(1, 0);

        this.marcadorMano2 = this.add.text(520, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff'
        });
    }

    colocarBola() {
        const velocidad = 500;
        let anguloInicial = Math.random() * (Math.PI / 4 * 3 - Math.PI / 4) + Math.PI / 4;
        if (Math.floor(Math.random() * 2) === 1) anguloInicial += Math.PI;
    
        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;
    

        this.bola.destroy();
    

        this.bola = this.physics.add.sprite(480, 320, 'bola');
        this.bola.setScale(0.1); 
        this.bola.play('brillar');
    
        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);
    
        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;
    
        this.physics.add.collider(this.bola, this.mano1);
        this.physics.add.collider(this.bola, this.mano2);
        this.alguienGano = false;
    }

    controlesVisuales(btn1, btn2, player) {

        const upbtn = this.add.sprite(btn1.x, btn1.y, 'leftbtn').setInteractive();
        const downbtn = this.add.sprite(btn2.x, btn2.y, 'leftbtn').setInteractive();
        downbtn.flipY = true;

        downbtn.on('pointerdown', () => player.setData('direccionVertical', -1));
        upbtn.on('pointerdown', () => player.setData('direccionVertical', 1));
        downbtn.on('pointerup', () => player.setData('direccionVertical', 0));
        upbtn.on('pointerup', () => player.setData('direccionVertical', 0));
    }
}

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scene: Escena,
    physics: {
        default: 'arcade',
    }
};

new Phaser.Game(config);