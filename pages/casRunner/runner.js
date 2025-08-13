const canvas = document.querySelector(".gameCanvas");
const ctx = canvas.getContext('2d');

objColor = "rgb(48, 57, 138)";
floorLevel = 300;


class obstacle {
    constructor(width) {
        this.height = 50;
        this.width = width;
        this.x = canvas.width;
        this.y = floorLevel;
    }

    drawRectangle() {
        ctx.save();
        ctx.fillStyle = objColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

class playerClass {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = 0;
        this.y = floorLevel;
        this.jump = 0;
        this.maxJumpSpeed = 12
        this.jumpSpeed = this.maxJumpSpeed;
    }
    
    drawPlayer() {
        ctx.save();
        ctx.fillStyle = objColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    checkJump() {
        if (this.jump == 1) {
            console.log("jumping " + this.jump);
            this.y -= this.jumpSpeed;
            this.jumpSpeed -= .5;
            if (this.y <= 0 || this.jumpSpeed <= 0) {
                this.jump = 2;
                this.jumpSpeed = 0;
            }
        
        } else if (this.jump == 2 && this.y < floorLevel) {
            console.log("falling " + this.jump);
            this.y += this.jumpSpeed;
            this.jumpSpeed += .5;
            if (this.y >= floorLevel) {
                this.y = floorLevel;
                this.jumpSpeed = this.maxJumpSpeed;
                this.jump = 0;
            }
        } else {
            //console.log("no Jump");
        }
    }
}

const obstacles =[];
const player = new playerClass();

addEventListener("keydown", keyDown);
addEventListener("keyup", keyUp);


function keyDown(e) {
    if (player.jump != 0) {
        return;
    }
    switch (e.key) {
        case " ":
            player.jump = 1;
            break;
        case "w":
            player.jump = 1;
            break;
        case "ArrowUp":
            player.jump = 1;
            break;
        default:
            break;
    }
}

function keyUp(e) {
    if (player.jump != 1) {
        return;
    }
    switch (e.key) {
        case " ":
            player.jumpSpeed = 0;
            player.jump = 2;
            break;
        case "w":
            player.jumpSpeed = 0;
            player.jump = 2;
            break;
        case "ArrowUp":
            player.jumpSpeed = 0;
            player.jump = 2;
            break;
        default:
            break;
    }
}


function random(max) {
    return Math.floor(Math.random() * max);
}













function drawBackdrop() {
    ctx.save();
    ctx.fillStyle = " rgb(255, 222, 130)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = objColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 352);
    ctx.lineTo(canvas.width, 350);
    ctx.stroke();
    ctx.restore();
}


async function waitFor(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  })
}

function paint() {
    drawBackdrop();
    for (const ob of obstacles) {
        ob.drawRectangle();
    }
    player.drawPlayer();
}

async function gameLoop() {
    while (true) {
        await waitFor(10);
        player.checkJump();
        paint();
    }
}

gameLoop();
