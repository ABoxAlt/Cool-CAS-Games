const canvas = document.querySelector(".gameCanvas");
const ctx = canvas.getContext('2d');

objColor = "rgb(48, 57, 138)";



class obstacle {
    constructor(width) {
        this.height = 50;
        this.width = width;
        this.x = canvas.width;
        this.y = 100;
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
        this.y = 100;
        this.jump = 0;
        this.jumpSpeed = 5;
        this.airTime = 40;
    }
    
    drawPlayer() {
        ctx.save();
        ctx.fillStyle = objColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    checkJump() {
        if (this.jump < this.airTime && this.jump > 0) {
            console.log("jumping" + this.jump);
            this.y -= this.jumpSpeed;
            if (this.y <= 0) {
                this.y = 0;
                this.jump ++;
            }
        
        } else if (this.jump == this.airTime && this.y < 100) {
            this.y += this.jumpSpeed;
            if (this.y >= 100) {
                this.y = 100;
                this.jump = 0;
            }
        } else {
            console.log("no Jump");
        }
    }
}

const obstacles =[];
const player = new playerClass();

addEventListener("keyup", keyUp);


function keyUp(e) {
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
            player.jump = 1;
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
    ctx.moveTo(0, 152);
    ctx.lineTo(canvas.width, 150);
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
