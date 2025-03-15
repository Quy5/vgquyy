const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImage = new Image();
birdImage.src = "bird.png"; // Đảm bảo file bird.png có trong thư mục

const bird = {
    x: 50,
    y: 150,
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

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        if (gameOver) {
            restartGame();
        } else {
            bird.jump();
        }
    }
});

document.addEventListener("mousedown", function () {
    if (gameOver) {
        restartGame();
    } else {
        bird.jump();
    }
});

const pipes = [];
const pipeWidth = 50;
const pipeGap = 180;
let frame = 0;

function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 20)) + 20;
    pipes.push({ x: canvas.width, y: 0, width: pipeWidth, height: pipeHeight });
    pipes.push({ x: canvas.width, y: pipeHeight + pipeGap, width: pipeWidth, height: canvas.height - pipeHeight - pipeGap });
}

function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 1;
    }
    if (frame % 180 === 0) {
        createPipe();
    }
    pipes.forEach((pipe, index) => {
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
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

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.update();
    bird.draw();
    updatePipes();
    drawPipes();
    
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
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2 - 20);
    ctx.fillText("Nhấn SPACE để chơi lại", canvas.width / 2 - 130, canvas.height / 2 + 20);
}

function restartGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    frame = 0;
    gameOver = false;
    gameLoop();
}

gameLoop();
