//This just selects the html element of the canvas to adjust with javascript
const canvas = document.querySelector(".gameCanvas");

//This lets us draw things on the canvas
const ctx = canvas.getContext('2d');

//This adds an event for when the mouse is pressed down, events aren't great for a lot of games
//but they work fine for tic tac toe since you are just selecting options
//they're usually bad since they stop everything to run the event
canvas.addEventListener("mouseup", onMouseUp);

const symbolSize = 75;

//Outputs the mouse coordinates (based on the canvas not the webpage)
function onMouseUp(e) {
    drawX(e.offsetX, e.offsetY);
    drawO(e.offsetX, e.offsetY);
}

function drawBoard() {
    const hudColor = 'rgba(82, 90, 167, 1)';
    const backColor = 'rgba(174, 182, 255, 1)';
    const lineColor = 'rgba(136, 148, 255, 1)';
    //This sets the background
    //ctx.save saves any changes made to css so it can be restored after these actions
    ctx.save();
    //fillStyle is the color
    ctx.fillStyle = backColor;
    //fillRect needs x y coordinates and then a width and height
    //the x y coordinates pretain to the top left corner of the rectangle
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = hudColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height/4);
    ctx.fillRect(0, 0, canvas.width/4, canvas.height);
    ctx.strokeStyle = lineColor;
    //This sets the linewidth
    //canvas being divided and using Math.floor() just gives 6 in this case but if this were to
    //be scaled up it would still be the same dimensions
    ctx.lineWidth = Math.floor(canvas.width/36);
    ctx.beginPath();
    for (let i = 200; i < 400; i += 100) {
        ctx.moveTo(i, 100);
        ctx.lineTo(i, 400);
    }
    for (let i = 200; i < 400; i += 100) {
        ctx.moveTo(100, i);
        ctx.lineTo(400, i);
    }
    ctx.stroke();
    
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

function gameStart() {
    drawBoard();

}

gameStart();