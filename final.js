const canvas = document.getElementById('gameCanvas'); // elemento canvas del HTML
const context = canvas.getContext('2d'); // contexto 2D del canvas

// Propiedades de la bola
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 2,
    dy: -2,
    color: '#0095DD'
};

// Propiedades de la pala
const paddle = {
    height: 10,
    width: 75,
    x: (canvas.width - 75) / 2,
    speed: 7,
    color: '#0095DD'
};

let rightPressed = false; // Variable para el estado de la tecla derecha presionada
let leftPressed = false; // Variable para el estado de la tecla izquierda presionada

// Propiedades de los ladrillos
const brick = {
    rowCount: 3,
    columnCount: 5,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30
};

// iniciador de matriz de ladrillos
let bricks = [];
for (let c = 0; c < brick.columnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brick.rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0; // Puntuación del juego
let lives = 5; // Número de vidas
let rounds = 3; // Número de rondas

// Event listeners para el teclado y el ratón
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

// Manejadores de eventos para el teclado
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Manejador de eventos para el movimiento del ratón
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

// Función para dibujar la bola
function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

// Función para mover la bola y gestionar rebotes
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Rebote en los bordes del canvas
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Si la bola toca el fondo sin tocar la pala, pierde una vida
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        } else {
            lives--;
            if (lives > 0) {
                resetBallAndPaddle();
                alert('Vida perdida. Te quedan ' + lives + ' vidas.');
            } else {
                rounds--;
                if (rounds > 0) {
                    alert('Ronda perdida. Quedan ' + rounds + ' rondas.');
                    resetBallAndPaddle();
                } else {
                    alert('GAME OVER');
                    document.location.reload(); // Reinicia el juego si se acaban las rondas
                }
            }
        }
    }
}

// Función para dibujar la pala
function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    context.fillStyle = paddle.color;
    context.fill();
    context.closePath();
}

// Función para finalizar el juego si todos los ladrillos han sido eliminados
function checkGameEnd() {
    if (score === brick.rowCount * brick.columnCount) {
        rounds--;
        if (rounds > 0) {
            alert('¡Ganaste esta ronda! Quedan ' + rounds + ' rondas.');
            resetBallAndPaddle();
        } else {
            alert('¡GANASTE EL JUEGO!'); // Si no hay rondas restantes
            document.location.reload();
        }
    }
}

// Función para dibujar los ladrillos y detectar colisiones
function drawBricks() {
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
                const brickY = r * (brick.height + brick.padding) + brick.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brick.width, brick.height);
                context.fillStyle = '#0095DD';
                context.fill();
                context.closePath();
            }
        }
    }
}

// Función para detectar colisiones entre la bola y los ladrillos
function collisionDetection() {
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ball.x > b.x &&
                    ball.x < b.x + brick.width &&
                    ball.y > b.y &&
                    ball.y < b.y + brick.height
                ) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score++;
                    checkGameEnd();
                }
            }
        }
    }
}

// Función para dibujar la puntuación y las vidas restantes
function drawScoreAndLives() {
    context.font = '16px Arial';
    context.fillStyle = '#0095DD';
    context.fillText('Score: ' + score, 8, 20);
    context.fillText('Lives: ' + lives, canvas.width - 100, 20);
    context.fillText('Rounds: ' + rounds, canvas.width / 2 - 30, 20);
}

// Función para reiniciar la bola y la pala para una nueva vida o ronda
function resetBallAndPaddle() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 2;
    ball.dy = -2;
    paddle.x = (canvas.width - paddle.width) / 2;
}

// Función principal de dibujo y actualización del juego
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
    drawBricks(); // Dibujo de los ladrillos
    drawBall(); // Dibujo de la bola
    drawPaddle(); // Dibujo de la pala
    drawScoreAndLives(); // Dibujo de la puntuación y vidas
    collisionDetection(); // Detección de colisiones entre la bola y los ladrillos
    moveBall(); // Movimiento de la bola
    requestAnimationFrame(draw); // Continua la animación del juego
}

draw(); // Inicia el juego
