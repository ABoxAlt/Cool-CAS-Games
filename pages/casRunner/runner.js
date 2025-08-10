const canvas = document.querySelector(".gameCanvas");
const ctx = canvas.getContext('2d');

class obstacle {
    constructor(width) {
        this.height = 50;
        this.width = width;
        this.x = 0;
        this.y = 100;
    }

    drawRectangle() {
        ctx.save();
        ctx.fillStyle = 'rgb(150, 255, 255)'
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
    }
    
    drawPlayer() {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 150, 150, 1)'
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

const obstacles =[];
const player = new playerClass();

function random(max) {
    return Math.floor(Math.random() * max);
}





function drawBackdrop() {
    ctx.save();
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(canvas.width, 150);
    ctx.stroke();
    ctx.restore();
}



function paint() {
    drawBackdrop();
    for (const ob of obstacles) {
        ob.drawRectangle();
    }
    player.drawPlayer();
}





paint();