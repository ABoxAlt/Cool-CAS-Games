const canvas = document.querySelector(".gameCanvas");
const ctx = canvas.getContext('2d');

//objColor = "rgb(48, 57, 138)";
floorLevel = 350;


class obstacle {
    constructor(width) {
        this.height = 50;
        this.width = width;
        this.x = canvas.width;
        this.x2 = this.x + this.width;
        this.y = floorLevel - this.height;
        this.speed = 5;
        this.active = true;
        this.objColor = "rgba(160, 170, 255, 1)";
    }

    drawObstacle() {
        ctx.save();
        ctx.fillStyle = this.objColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    moveObstacle() {
        if (this.x > 0 - this.width) {
            this.x -= this.speed;
        } else if (this.x <= 0 - this.width) {
            this.active = false;
        }
        this.x2 = this.x + this.width;
    }
}

class playerClass {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = 100;
        this.x2 = this.x + this.width;
        this.y = floorLevel - this.height;
        this.jump = 0;
        this.maxJumpSpeed = 12
        this.jumpSpeed = this.maxJumpSpeed;
        this.playerColor = "rgb(48, 57, 138)";
    }
    
    drawPlayer() {
        ctx.save();
        ctx.fillStyle = this.playerColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    checkJump() {
        if (this.jump == 1) {
            //console.log("jumping " + this.jump);
            this.y -= this.jumpSpeed;
            this.jumpSpeed -= .5;
            if (this.y <= 0 || this.jumpSpeed <= 0) {
                this.jump = 2;
                this.jumpSpeed = 0;
            }
        
        } else if (this.jump == 2 && this.y < floorLevel - this.height) {
            //console.log("falling " + this.jump);
            this.y += this.jumpSpeed;
            this.jumpSpeed += .5;
            if (this.y >= floorLevel - this.height) {
                this.y = floorLevel - this.height;
                this.jumpSpeed = this.maxJumpSpeed;
                this.jump = 0;
            }
        } else {
            //console.log("no Jump");
        }
    }
}

const obstacles =[];

function destroyObstacles() {
    for (const ob of obstacles) {
        if (!ob.active) {
            //console.log("Destroyed obstacle with index : " + obstacles.indexOf(ob));
            obstacles.splice(0, 1);
        }
    }
}

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
        case "e":
            spawnObstacle();
            break;
        case "f":
            console.log(obstacles);
            break;
        default:
            break;
    }
}

function spawnObstacle() {
    const obstacleType = random(3);
    switch (obstacleType) {
        case 0:
            obstacles.push(new obstacle(30));
            break;
        case 1:
            obstacles.push(new obstacle(50));
            break;
        case 2:
            obstacles.push(new obstacle(70));
            break;
        default:
            console.log("There was an error when spawning an object. obstacleType was : " + obstacleType);
    }
    //console.log("Debug: Spawned Obstacle");
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











function checkObstacles() {
    destroyObstacles();
    for (const ob of obstacles) {
        ob.moveObstacle();
        console.log(player.y + player.height, floorLevel - ob.height);
        if (player.y + player.height >= floorLevel - ob.height) {
            if (ob.x >= player.x && ob.x <= player.x2 || ob.x2 >= player.x && ob.x2 <= player.x2 || player.x > ob.x && player.x < ob.x2) {
                //console.log("collided with player");
                player.playerColor = "white";
            }
        }
    }
}

function drawBackdrop() {
    ctx.save();
    ctx.fillStyle = " rgb(255, 222, 130)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgb(48, 57, 138)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, floorLevel);
    ctx.lineTo(canvas.width, floorLevel);
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
        ob.drawObstacle();
    }
    player.drawPlayer();
}

async function gameLoop() {
    while (true) {
        await waitFor(10);
        player.checkJump();
        checkObstacles();

        paint();
        player.playerColor = "rgb(48, 57, 138)";
    }
}

gameLoop();
