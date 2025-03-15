const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const birdImage = new Image();
birdImage.src = "bird.png";

const bird = {
    x: 50,  
    y: canvas.height / 2,
    width: 30,
    height: 30,
    gravity: 0.15, 
    lift: -4.5, 
    velocity: 0,    
    draw() {
        ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
    },
    update() {  
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    jump() {
        this.velocity = this.lift;
    }
};

function handleJump() {
    if (gameOver) {
        restartGame();
    } else {
        bird.jump();
    }
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        handleJump();
    }
});

document.addEventListener("mousedown", handleJump);
document.addEventListener("touchstart", function (event) {
    event.preventDefault(); 
    handleJump();
});

const pipes = [];
const pipeWidth = 50;
const pipeGap = 160;
let frame = 0;
let score = 0;
let pipeSpeed = 1.5; // Tốc độ di chuyển của ống

function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 20)) + 20;
    pipes.push({ x: canvas.width, y: 0, width: pipeWidth, height: pipeHeight, scored: false });
    pipes.push({ x: canvas.width, y: pipeHeight + pipeGap, width: pipeWidth, height: canvas.height - pipeHeight - pipeGap, scored: false });
}

function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
    }
    if (frame % 180 === 0) { 
        createPipe();
    }
    pipes.forEach((pipe, index) => {
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
        }
    });


    pipes.forEach(pipe => {
        if (!pipe.scored && pipe.x + pipe.width < bird.x) {
            pipe.scored = true;
            score += 0.5;

    
            if (score % 40 === 0) {
                pipeSpeed += 0.5; 
            }
        }
    });
}

function drawPipes() {
    ctx.fillStyle = "#FF99CC";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });
}

function checkCollision() {
    for (let pipe of pipes) {
        if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x && bird.y < pipe.y + pipe.height && bird.y + bird.height > pipe.y) {
            return true;
        }
    }
    return false;
}

let gameOver = false;

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 40);
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update();
    bird.draw();
    updatePipes();
    drawPipes();
    drawScore(); 
    
    if (checkCollision()) {
        gameOver = true;
        showGameOverScreen();
        return;
    }
    
    frame++;
    requestAnimationFrame(gameLoop);
}

function showGameOverScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 60, canvas.height / 2 - 20);
    ctx.fillText("Nhấn SPACE hoặc CHẠM để chơi lại", canvas.width / 2 - 140, canvas.height / 2 + 20);
    ctx.fillText("Điểm số: " + score, canvas.width / 2 - 40, canvas.height / 2 + 60);
}

function restartGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    frame = 0;
    score = 0;
    pipeSpeed = 1.5; 
    gameOver = false;
    gameLoop();
}


gameLoop();
