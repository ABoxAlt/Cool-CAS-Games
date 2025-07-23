//This just selects the html element of the canvas to adjust with javascript
const canvas = document.querySelector(".gameCanvas");

//This lets us draw things on the canvas
const ctx = canvas.getContext('2d');

//This adds an event for when the mouse is pressed down, events aren't great for a lot of games
//but they work fine for tic tac toe since you are just selecting options
//they're usually bad since they stop everything to run the event
canvas.addEventListener("mouseup", onMouseUp);

const symbolSize = 50;

let turn = 0;
let win = false;
const board = [[3, 3, 3], [3, 3, 3], [3, 3, 3]];

//Outputs the mouse coordinates (based on the canvas not the webpage)
function onMouseUp(e) {
    if (win) {
        win = false;
        gameStart();
    }

    let x = parseInt(e.offsetX);
    let y = parseInt(e.offsetY);

    const xOffset = 25;
    const yOffset = 25;

    if (x < 100) {
        x = 0;
    } else if (x < 200) {
        x = 100;
    } else if (x < 300) {
        x = 200;
    } else {
        console.log('Error, could not place symbol');
    }

    if (y < 100) {
        y = 0;
    } else if (y < 200) {
        y = 100;
    } else if (y < 300) {
        y = 200;
    } else {
        console.log('Error, could not place symbol');
    }

    if (board[((y/100))][((x/100))] != 3) {
        console.log("symbol allready placed in square");
        return;
    }

    if (turn == 0) {
        drawX(x + xOffset, y + yOffset);
        turn ++;
        board[((y/100))][((x/100))] = 0;
    } else {
        drawO(x + xOffset, y + yOffset);
        turn --;
        board[((y/100))][((x/100))] = 1;
    }
}

function drawBoard() {
    const backColor = 'rgba(174, 182, 255, 1)';
    const squareColor = 'rgba(136, 148, 255, 1)';
    //This sets the background
    //ctx.save saves any changes made to css so it can be restored after these actions
    ctx.save();
    //fillStyle is the color
    ctx.fillStyle = backColor;
    //fillRect needs x y coordinates and then a width and height
    //the x y coordinates pretain to the top left corner of the rectangle
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = squareColor;
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillRect(0, 200, 100, 100);
    ctx.fillRect(200, 0, 100, 100);
    ctx.fillRect(200, 200, 100, 100);
    ctx.fillRect(100, 100, 100, 100);

    ctx.restore();
}

function xOSetup() {
    ctx.beginPath();
    ctx.lineWidth = 11;
    ctx.strokeStyle = 'rgb(255, 20, 147)';
}

function drawX(x, y) {
    ctx.save();
    xOSetup();
    ctx.lineCap = 'round';
    ctx.moveTo(x, y);
    ctx.lineTo(x + symbolSize, y + symbolSize);
    ctx.moveTo(x + symbolSize, y);
    ctx.lineTo(x, y + symbolSize);
    ctx.stroke();
    ctx.restore();
}

function drawO(x, y) {
    ctx.save();
    xOSetup();
    ctx.arc(x + symbolSize/2, y + symbolSize/2, symbolSize/2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
}

function drawWin(line) {
    ctx.save();
    xOSetup();
    ctx.lineCap = 'round';
    ctx.beginPath();
    switch (line) {
        case 0:
            ctx.moveTo(20, 20);
            ctx.lineTo(280, 280);
            break;
        case 1:
            ctx.moveTo(280, 20);
            ctx.lineTo(20, 280);
            break;
        case 2:
            ctx.moveTo(20, 50);
            ctx.lineTo(280, 50);
            break;
        case 3:
            ctx.moveTo(20, 150);
            ctx.lineTo(280, 150);
            break;
        case 4:
            ctx.moveTo(20, 250);
            ctx.lineTo(280, 250);
            break;
        case 5:
            ctx.moveTo(50, 20);
            ctx.lineTo(50, 280);
            break;
        case 6:
            ctx.moveTo(150, 20);
            ctx.lineTo(150, 280);
            break;
        case 7:
            ctx.moveTo(250, 20);
            ctx.lineTo(250, 280);
            break;
    }
    ctx.stroke();
    ctx.restore();
}

function checkWin() {}

function gameStart() {
    drawBoard();
    turn = 0;
}

gameStart();
drawWin(2);