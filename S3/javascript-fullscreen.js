class Escena extends Phaser.Scene {
    preload() {
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.spritesheet('bola', 'img/bola.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.image('mano1', 'img/mano1.png');
        this.load.image('mano2', 'img/mano2.png');
        this.load.image('leftbtn', 'img/flecha.png');
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Escalamos el fondo en alto y calculamos el ancho real visible
        this.fondo = this.add.image(centerX, centerY, 'fondo');
        const escalaFondo = this.scale.height / this.fondo.height;
        this.fondo.setScale(escalaFondo).setScrollFactor(0);

        const fondoVisibleWidth = this.fondo.width * this.fondo.scaleX;
        const fondoIzquierda = centerX - fondoVisibleWidth / 2;
        const fondoDerecha = centerX + fondoVisibleWidth / 2;

        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();

        this.bola = this.physics.add.sprite(centerX, centerY, 'bola');

        this.anims.create({
            key: 'brillar',
            frames: this.anims.generateFrameNumbers('bola', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.bola.play('brillar');

        // Mano izquierda (jugador 1)
        this.mano1 = this.physics.add.sprite(fondoIzquierda + 70, centerY, 'mano1');
        this.mano1.body.immovable = true;
        this.mano1.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano1);
        this.mano1.setCollideWorldBounds(true);

        // Mano derecha (jugador 2)
        this.mano2 = this.physics.add.sprite(fondoDerecha - 70, centerY, 'mano2');
        this.mano2.body.immovable = true;
        this.mano2.setSize(60, 250);
        this.physics.add.collider(this.bola, this.mano2);
        this.mano2.setCollideWorldBounds(true);

        // Movimiento inicial aleatorio
        const velocidad = 650;
        let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
        if (Math.random() < 0.5) anguloInicial += Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.setBounce(1);
        this.bola.setCollideWorldBounds(true);
        this.physics.world.setBoundsCollision(false, false, true, true);
        this.bola.body.velocity.x = vx;
        this.bola.body.velocity.y = vy;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.teclaW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.teclaS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        // Teclas W y S para jugador 2
        this.keys = this.input.keyboard.addKeys({
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S
        });

        // Controles visuales
        this.controlesVisuales(
            { x: fondoIzquierda + 50, y: 50 },
            { x: fondoIzquierda + 50, y: this.scale.height - 50 },
            this.mano1
        );
        this.controlesVisuales(
            { x: fondoDerecha - 50, y: 50 },
            { x: fondoDerecha - 50, y: this.scale.height - 50 },
            this.mano2
        );

        this.alguienGano = false;
        this.pintarMarcador();
    }

    update() {
        this.bola.rotation += 0.1;
    
        const bordeIzquierdoFondo = this.fondo.x - (this.fondo.width * this.fondo.scaleX) / 2;
        const bordeDerechoFondo = this.fondo.x + (this.fondo.width * this.fondo.scaleX) / 2;
    
        if (this.bola.x < bordeIzquierdoFondo && !this.alguienGano) {
            alert('player1 ha perdido');
            this.alguienGano = true;
            this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
            this.colocarPelota();
        } else if (this.bola.x > bordeDerechoFondo && !this.alguienGano) {
            alert('player2 ha perdido');
            this.alguienGano = true;
            this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
            this.colocarPelota();
        }
    
        if (this.mano1.getData('direccionVertical') === 1 || this.teclaW.isDown) {
            this.mano1.y -= 5;
        } else if (this.mano1.getData('direccionVertical') === -1 || this.teclaS.isDown) {
            this.mano1.y += 5;
        }

        if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1) {
            this.mano2.y -= 5;
        } else if (this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1) {
            this.mano2.y += 5;
        }
    }

    pintarMarcador() {
        const centerX = this.scale.width / 2;
        this.marcadorMano1 = this.add.text(centerX - 40, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff',
            align: 'right'
        }).setOrigin(1, 0);

        this.marcadorMano2 = this.add.text(centerX + 40, 75, '0', {
            fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff'
        });
    }

    colocarPelota() {
        const velocidad = 650;
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        let anguloInicial = Math.random() * (Math.PI / 4 * 3 - Math.PI / 4) + Math.PI / 4;
        if (Math.random() < 0.5) anguloInicial += Math.PI;

        const vx = Math.sin(anguloInicial) * velocidad;
        const vy = Math.cos(anguloInicial) * velocidad;

        this.bola.destroy();
        this.bola = this.physics.add.sprite(centerX, centerY, 'bola');
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
    width: window.innerWidth,
    height: window.innerHeight,
    scene: Escena,
    physics: {
        default: 'arcade',
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
