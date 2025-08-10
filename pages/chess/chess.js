//This just selects the html element of the canvas to adjust with javascript
const canvas = document.querySelector(".gameCanvas");

//This lets us draw things on the canvas
const ctx = canvas.getContext('2d');

//This adds an event for when the mouse is pressed down, events aren't great for a lot of games
//but they work fine for tic tac toe since you are just selecting options
//they're usually bad since they stop everything to run the event
canvas.addEventListener("mouseup", onMouseUp);

let turn = 0;
let win = false;
let board;
const allPieces = [];

//Outputs the mouse coordinates (based on the canvas not the webpage)
function onMouseUp(e) {
    if (win) {
        win = false;
        gameStart();
        return;
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
    checkWin();
}

const cellSize = canvas.width / 8;
async function drawBoard() {
    console.log("drawBoard")
    const lightColor = 'rgba(174, 182, 255, 1)';
    const darkColor = 'rgba(136, 148, 255, 1)';
    //This sets the background
    //ctx.save saves any changes made to css so it can be restored after these actions
    ctx.save();
    //fillStyle is the color
    ctx.fillStyle = lightColor;
    //fillRect needs x y coordinates and then a width and height
    //the x y coordinates pretain to the top left corner of the rectangle
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw chess board
    ctx.fillStyle = darkColor;
    // loop thru rows & cols
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 4; x++) {
            ctx.fillRect(
                x * cellSize * 2 + (y + 1) % 2 * cellSize, // alternate cells
                y * cellSize,
                cellSize, // same width & height to make square
                cellSize
            );
        }
    }

    // wait for img to load
    let allImg = [];
    for (piece of allPieces) {
        allImg.push(piece.sprite);
    }

    await Promise.all(
        allImg.map(
            (image) =>
            new Promise((resolve) => image.addEventListener("load", resolve)),
        ),
    );

    // draw pieces
    console.log(allPieces);
    allPieces.forEach(element => {
        console.log("foreach");
        element.draw();
    });

    ctx.restore();
}

function gameStart() {
    board = createBoard();
    drawBoard();
    turn = 0;
}

function createBoard() {
    let board = [];

    // black back rank
    let bBack = [
        new Rook(true, 0, 0), 
        new Knight(true, 1, 0), 
        new Bishop(true, 2, 0), 
        new Queen(true, 3, 0), 
        new King(true, 4, 0), 
        new Bishop(true, 5, 0), 
        new Knight(true, 6, 0), 
        new Rook(true, 7, 0)
    ];
    
    board.push(bBack);
    
    // black pawns
    let bPawns = []
    for (let x = 0; x < 8; x++) {
        bPawns.push(new Pawn(true, x, 1));
    }

    board.push(bPawns);

    // empty no mans land
    for (let y = 0; y < 4; y++) {
        let a = []
        for (let x = 0; x < 8; x++) {
            a.push(false);
        }
        board.push(a)
    }

    // white pawns
    let wPawns = []
    for (let x = 0; x < 8; x++) {
        wPawns.push(new Pawn(false, x, 6));
    }

    // white back rank
    let wBack = [
        new Rook(false, 0, 7), 
        new Knight(false, 1, 7), 
        new Bishop(false, 2, 7), 
        new Queen(false, 3, 7), 
        new King(false, 4, 7), 
        new Bishop(false, 5, 7), 
        new Knight(false, 6, 7), 
        new Rook(false, 7, 7)
    ];

    board.push(wBack);

    // add all pieces to an array
    let pieceRows = [bBack, bPawns, wBack, wPawns];
    for (row of pieceRows) {
        for (piece of row) {
            allPieces.push(piece);
        }
    }

    return board;
}

window.onload = () => gameStart();

class Piece {
    sprite;
    name;

    constructor(isBlack, x, y, name) {
        this.name = name;
        console.log(this.name)
        this.isBlack = isBlack;
        this.sprite = new Image();
        this.sprite.src = `../../images/chess-pieces/${this.name}_${this.isBlack ? "black" : "white"}.png`;
        this.x = x;
        this.y = y;
        console.log("constructor")
    }

    draw() {
        console.log("draw")
        console.log(this.sprite);
        ctx.drawImage(
            this.sprite,
            this.x * cellSize,
            this.y * cellSize,
            cellSize,
            cellSize
        );
    }
}

class Pawn extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "pawn");
    }
    hasMoved = false;
}

class Rook extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "rook");
    }
}

class Knight extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "knight");
    }
}

class Bishop extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "bishop");
    }
}

class Queen extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "queen");
    }
}

class King extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "king");
    }
}
