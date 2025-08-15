//This just selects the html element of the canvas to adjust with javascript
const canvas = document.querySelector(".gameCanvas");

//This lets us draw things on the canvas
const ctx = canvas.getContext("2d");

//This adds an event for when the mouse is pressed down, events aren't great for a lot of games
//but they work fine for tic tac toe since you are just selecting options
//they're usually bad since they stop everything to run the event
canvas.addEventListener("mouseup", onMouseUp);

const GameState = Object.freeze({
    SELECT: 0,
    MOVE: 1,
    PROMOTE: 2,
    END: 3
});

let turn;
let board;
const ALL_PIECES = [];
let state = GameState.SELECT;
let selectedPiece = null;
const CHESS_IMAGES = loadImages();

//Outputs the mouse coordinates (based on the canvas not the webpage)
function onMouseUp(e) {
    switch (state) {
        case GameState.SELECT: {
            const [x, y] = getMousePos(e);
            selectedPiece = board[y][x];
            if (selectedPiece === null)
                return;
            else {
                state = GameState.MOVE;
                ctx.save();
                ctx.strokeColor = "white";
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.restore();
            }
            break;
        }
        case GameState.MOVE: {
            const [x, y] = getMousePos(e);
            let response = selectedPiece.checkMove(x, y);

            // check if piece was clicked again, indicating a cancelled move
            if (selectedPiece.x == x && selectedPiece.y == y) {
                // TODO: erase black outline around piece
                drawBoard();
                state = GameState.SELECT;
            }
            if (!response.isValid)
                return;

            // check if there are squares that need to be empty
            if (Object.hasOwn(response, "squares")) {
                let invalid = false;
                for (const s of response.squares) {
                    let square = board[s[1]][s[0]];
                    if (square !== null) {
                        invalid = true;
                        break;
                    }
                }
                if (!invalid) {
                    // TODO:
                    state = GameState.SELECT;
                }
            }
            // TODO:
            turn++;
            break;
        }
        case GameState.PROMOTE:

            break;
        case GameState.END:
            state = GameState.SELECT;
            gameStart();
            break;
        default:
            console.log("ERROR: state unset??");
            break;
    }

    checkWin();
}

function getMousePos(e) {
    // get mouse position
    let x = parseInt(e.offsetX);
    let y = parseInt(e.offsetY);

    console.log(`X: ${x}, Y: ${y}`);

    // scale to board
    x = Math.floor( x / 50 );
    y = Math.floor( y / 50 );

    return [ x, y ];
}

function checkWin() {
}

const cellSize = canvas.width / 8;
async function drawBoard() {
    console.log("drawBoard");
    const lightColor = "rgba(174, 182, 255, 1)";
    const darkColor = "rgba(136, 148, 255, 1)";
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
    await Promise.all(
        Object.values(CHESS_IMAGES).map(
            (image) =>
            new Promise((resolve) => image.addEventListener("load", resolve))
            //     {
            //     console.log(image);
            //     resolve();
            // })
        ),
    );

    // draw pieces
    console.log(ALL_PIECES);
    ALL_PIECES.forEach(element => {
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

async function loadImages() {
    let allPiecesNames = [
        "rook",
        "knight",
        "bishop",
        "queen",
        "king",
        "pawn"
    ];
    let colors = [
        "black",
        "white"
    ];

    // TODO: refactor into Dictionary if it's beneficial
    let output = {};
    for (const n of allPiecesNames) {
        for (const c of colors) {
            let img = new Image();
            let filename = `${n}_${c}.png`;
            img.src = "../../images/chess-pieces/" + filename;
            output[filename] = img;
        }
    }

    console.log(output);

    return output;
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
    let bPawns = [];
    for (let x = 0; x < 8; x++) {
        bPawns.push(new Pawn(true, x, 1));
    }

    board.push(bPawns);

    // empty no mans land
    for (let y = 0; y < 4; y++) {
        let a = [];
        for (let x = 0; x < 8; x++) {
            a.push(null);
        }
        board.push(a);
    }

    // white pawns
    let wPawns = [];
    for (let x = 0; x < 8; x++) {
        wPawns.push(new Pawn(false, x, 6));
    }

    board.push(wPawns);

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
    for (const row of pieceRows) {
        for (const piece of row) {
            ALL_PIECES.push(piece);
        }
    }

    return board;
}

window.onload = () => gameStart();

class Piece {
    spriteName;
    name;

    constructor(isBlack, x, y, name) {
        this.name = name;
        console.log(this.name);
        this.isBlack = isBlack;
        this.spriteName = `${this.name}_${this.isBlack ? "black" : "white"}.png`;
        this.x = x;
        this.y = y;
        console.log("constructor");
    }

    draw() {
        console.log("draw");
        ctx.drawImage(
            CHESS_IMAGES[this.spriteName],
            this.x * cellSize,
            this.y * cellSize,
            cellSize,
            cellSize
        );
    }

    // abstract method (override it in child classes to use)
    checkMove(x, y) {
        console.log(`${x}, ${y}`);
        throw new Error("You have to implement the method checkMove!");
    }
}

class Pawn extends Piece {
    hasMoved = false;

    constructor(isBlack, x, y) {
        super(isBlack, x, y, "pawn");
    }

    // checkMove(x, y) {
    //     
    // }
}

class Rook extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "rook");
    }

    checkMove(x, y) {
        // check if piece is on vertical or horizontal axes
        let dX = this.x - x;
        let dY = this.y - y;

        let xMoved = dX != 0;
        let yMoved = dY != 0;
        
        // if piece hasn't been moved or has been moved on both axes then the 
        // move is invalid
        if (xMoved == yMoved) {
            return {isValid: false};
        }

        // else the move is valid. find squares that have to be empty for move
        // to be valid
        let squares = [];

        let start = xMoved ? this.x : this.y;
        let end = xMoved ? x : y;
        let isPositive = end - start > 0;
        let delta = isPositive ? 1 : -1;

        for (let i = start; i != end; i += delta) {
            squares.push([xMoved ? i : x, yMoved ? y : i]);
        }

        return {isValid: true, squares: squares};
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
