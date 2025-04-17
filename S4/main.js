// Referencia al lienzo y su contexto de dibujo 2D
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Objeto para rastrear teclas presionadas
let keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Definición del jugador
const player = { x: 50, y: 50, w: 30, h: 30, color: 'red', speed: 3 };

//Cantidad de monedas
let coinPoints = 0;

//Definicion de sonidos
const collisionSound = new Audio('sound/colision.mp3');
collisionSound.volume = 0.4;

const coinSound = new Audio('sound/coin.mp3');
coinSound.volume = 0.4;

const newLevelSound = new Audio('sound/next-level.mp3');

const winSound = new Audio('sound/win.mp3');
winSound.volume = 0.6;

const chiptuneSound = new Audio('sound/chiptune-loop.mp3');
chiptuneSound.loop = true;
chiptuneSound.volume = 0.4;

// Definición de los niveles con obstáculos y monedas
const levels = [
    {
        obstacles: [
            { x: 100, y: 150, w: 400, h: 20 },
            { x: 300, y: 250, w: 20, h: 100 }
        ],
        coins: [
            { x: 500, y: 50, collected: false },
            { x: 50, y: 300, collected: false }
        ]
    },
    {
        obstacles: [
            { x: 200, y: 100, w: 200, h: 20 },
            { x: 200, y: 200, w: 20, h: 100 },
            { x: 400, y: 200, w: 20, h: 100 }
        ],
        coins: [
            { x: 550, y: 50, collected: false },
            { x: 550, y: 350, collected: false },
            { x: 80, y: 180, collected: false }
        ]
    },
    {
        obstacles: [
            { x: 100, y: 100, w: 400, h: 20 },
            { x: 150, y: 200, w: 20, h: 150 },
            { x: 300, y: 250, w: 250, h: 20 }
        ],
        coins: [
            { x: 100, y: 300, collected: false },
            { x: 500, y: 50, collected: false }
        ]
    }
];

// Índice del nivel actual
let currentLevel = 0;

// Función para detectar colisiones entre dos rectángulos
function rectsCollide(a, b) {
    return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
    );
}
// Función para dibujar un rectángulo (jugador u obstáculo)
function drawRect(obj) {
    ctx.fillStyle = obj.color || 'white';
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}

// Función que actualiza la lógica del juego
function update() {
    const level = levels[currentLevel];
    
    // Movimiento del jugador según las teclas presionadas
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player. speed;
    if (keys['ArrowLeft']) player.x -= player. speed;
    if (keys['ArrowRight']) player.x += player.speed;
    
    // Limitar al jugador dentro del canvas
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

    chiptuneSound.play();

    // Comprobación de colisión con obstáculos y retroceso del movimiento
    for (let obs of level.obstacles) {
        if (rectsCollide(player, obs)) {
            if (keys['ArrowUp' ]) player.y += player.speed;
            if (keys['ArrowDown' ]) player.y -= player.speed;
            if (keys['ArrowLeft' ]) player.x += player.speed;
            if (keys['ArrowRight' ]) player.x -= player. speed;   

            //Sonido al colisionar
            collisionSound.play();
        }
    }

    // Recolección de monedas
    for (let coin of level.coins) {
        if (!coin.collected) {
            if (
                player.x < coin.x + 15 &&
                player.x + player.w > coin.x &&
                player.y < coin.y + 15 &&
                player.y + player.h > coin.y
            ) {
                coin.collected = true;
                coinSound.play();
                coinPoints++;
            }
        }
    }

    // Si todas las monedas fueron recogidas, avanza al siguiente nivel
    const allCollected = level.coins.every(c => c.collected);
    if (allCollected) {
        if (currentLevel < levels.length - 1) {
            currentLevel++;
            newLevelSound.play();
            resetLevel();
        } else {
            winSound.play();
            alert("¡Felicitaciones! Nelson Jhon, Gil Pari!");
            currentLevel = 0;
            resetLevel();
            coinPoints = 0;
        }
    }
}

// Función para reiniciar la posición del jugador y el estado de las monedas
function resetLevel() {
    player.x = 50;
    player.y = 50;
    levels[currentLevel].coins.forEach(c => c.collected = false);

    // Reinicia el estado de las teclas
    keys = {};
}   
// Función que dibuja todos los elementos del juego
function draw() {
    // Limpia el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja al jugador
    drawRect(player);

    const level = levels[currentLevel];
    
    // Dibuja los obstáculos
    for (let obs of level.obstacles) {
        drawRect({ ... obs, color: 'gray' });
    }

    // Dibuja las monedas no recogidas
    for (let coin of level.coins) {
        if (!coin.collected) {
            ctx.fillStyle = 'gold';
            ctx.beginPath();
            ctx.arc(coin.x + 7.5, coin.y +7.5, 7.5, 0, Math.PI*2);
            ctx.fill();
        }
    }
    // Muestra el número del nivel actual
    ctx.fillStyle = 'white';
    ctx.font = '15px sans-serif';
    ctx.fillText(`Nivel: ${currentLevel + 1}`, 10, 20);
    //Muestra la cantidad de monedas
    ctx.fillStyle = 'gold';
    ctx.fillText(`💰: ${coinPoints}`, 70, 20);
}


// Bucle principal del juego (actualiza y dibuja en cada frame)
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Ejecuta de nuevo en el siguiente frame
}
    
// Inicializa el juego
resetLevel();
gameLoop();