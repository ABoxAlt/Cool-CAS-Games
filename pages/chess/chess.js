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
const CHESS_IMAGES = {};
const alertLabel = document.getElementById("alertLabel");
const turnLabel = document.getElementById("turnLabel");

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
                cancelMove("Piece double-clicked. Cancelled move.");
                return;
            }

            // check if move is valid
            if (!response.isValid) {
                cancelMove("That piece can't move there. Cancelled move.");
                return;
            }

            // check if there are squares that need to be empty
            if (Object.hasOwn(response, "squares")) {
                console.log(response.squares);
                for (const s of response.squares) {
                    let square = board[s[1]][s[0]];
                    if (square !== null) {
                        cancelMove("Piece in the way. Cancelled move.");
                        return;
                    }
                }
            }

            // check if the end pos has a piece of the same color
            let endPosPiece = board[y][x];
            if (endPosPiece !== null && endPosPiece.isBlack == selectedPiece.isBlack) {
                cancelMove("One of your pieces is already on that square. Cancelled move.");
                return;
            }

            // check for pawn promotion
            if (Object.hasOwn(response, "isPromoted")) {
                drawPromotion();
                state = GameState.PROMOTE;
            }

            console.log("valid move");

            // update the turn counter
            turn++;
            turnLabel.textContent = turn.toString();
            if (checkWin()) {
                alertLabel.textContent = "You won! Click the board to play again!";
                state = GameState.END;
            }
            state = GameState.SELECT;
            break;
        }
        case GameState.PROMOTE: {
            let x = selectedPiece.x;
            break;
        }
        case GameState.END: {
            state = GameState.SELECT;
            gameStart();
            break;
        }
        default:
            console.log("ERROR: state unset??");
            break;
    }
}

function drawPromotion() {

}

function cancelMove(msg) {
    state = GameState.SELECT;
    alertLabel.textContent = msg;
    drawBoard();
}

function getMousePos(e) {
    // get mouse position
    let x = parseInt(e.offsetX);
    let y = parseInt(e.offsetY);

    // console.log(`X: ${x}, Y: ${y}`);

    // scale to board
    x = Math.floor( x / 50 );
    y = Math.floor( y / 50 );

    return [ x, y ];
}

function checkWin() {
    // TODO:
    return false;
}

const cellSize = canvas.width / 8;
const lightColor = "rgba(174, 182, 255, 1)";
const darkColor = "rgba(136, 148, 255, 1)";
async function drawBoard() {
    // console.log("drawBoard");
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

    // TEST:  check img loaded
    // for (const [filename, img] of Object.entries(CHESS_IMAGES)) {
    //     console.log(`${filename}: ${img.complete && img.naturalWidth !== 0 ? "Success" : "Failure"}`);
    // }

    // draw pieces
    // console.log(ALL_PIECES);
    ALL_PIECES.forEach(element => {
        // console.log("foreach");
        element.draw();
    });

    ctx.restore();
}

async function gameStart() {
    board = createBoard();
    await loadImages();
    console.log("drawBoard");
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
    for (const n of allPiecesNames) {
        for (const c of colors) {
            let img = new Image();
            let filename = `${n}_${c}.png`;
            img.src = "../../images/chess-pieces/" + filename;
            CHESS_IMAGES[filename] = img;
        }
    }

    // wait for img to load
    await Promise.all(
        Object.values(CHESS_IMAGES).map(
            (image) =>
            new Promise((resolve) => image.addEventListener("load", resolve))
            //     {
            //     console.log(image);
            //     image.addEventListener("load", resolve);
            // })
        )
    );
    console.log("resolved");
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
    
    // // black pawns
    // let bPawns = [];
    // for (let x = 0; x < 8; x++) {
    //     bPawns.push(new Pawn(true, x, 1));
    // }
    let a = [];
    for (let x = 0; x < 8; x++) {
        a.push(null);
    }
    board.push(a);

    // empty no mans land
    for (let y = 0; y < 4; y++) {
        let a = [];
        for (let x = 0; x < 8; x++) {
            a.push(null);
        }
        board.push(a);
    }

    // white pawns
    // let wPawns = [];
    // for (let x = 0; x < 8; x++) {
    //     wPawns.push(new Pawn(false, x, 6));
    // }

    // board.push(wPawns);
    a = [];
    for (let x = 0; x < 8; x++) {
        a.push(null);
    }
    board.push(a);


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
    let pieceRows = [bBack, /*bPawns,*/ wBack/*, wPawns*/];
    for (const row of pieceRows) {
        for (const piece of row) {
            ALL_PIECES.push(piece);
        }
    }

    return board;
}

window.onload = () => gameStart();

// abstract class: don't instantiate
class Piece {
    spriteName;
    name;

    constructor(isBlack, x, y, name) {
        this.name = name;
        // console.log(this.name);
        this.isBlack = isBlack;
        this.spriteName = `${this.name}_${this.isBlack ? "black" : "white"}.png`;
        this.x = x;
        this.y = y;
        // console.log("constructor");
    }

    draw() {
        // console.log("draw");
        // console.log(CHESS_IMAGES[this.spriteName]);
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

    move(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Pawn extends Piece {
    hasMoved = false;

    constructor(isBlack, x, y) {
        super(isBlack, x, y, "pawn");
    }

    checkMove(x, y) {
        let dX = x - this.x;
        let dY = y - this.y;

        let absX = Math.abs(dX);
        let absY = Math.abs(dY);

        // check for forward
        if (absX == 0 && absY == 1) {
            return {isValid: true};
        // check for double
        } else if (absY == 2 && !this.hasMoved) {
            this.hasMoved = false;
            return {isValid: true};
        // check for en passant or capture
        } else if (absX == 1 && absY == 1) {
            return {isValid: true, capture: true};
        }

    }
}

class Rook extends Piece {
    hasMoved = false;

    constructor(isBlack, x, y) {
        super(isBlack, x, y, "rook");
    }

    checkMove(x, y) {
        console.log(`start: ${this.x}, ${this.y}`);
        console.log(`end: ${x}, ${y}`);
        // check if piece is on vertical or horizontal axes
        let dX = x - this.x;
        let dY = y - this.y;

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

        for (let i = start + delta; i != end; i += delta) {
            squares.push([xMoved ? i : x, yMoved ? i : y]);
        }

        if (!this.hasMoved) {
            this.hasMoved = true;
        }
        return {isValid: true, squares: squares};
    }
}

class Knight extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "knight");
    }

    checkMove(x, y) {
        // console.log(`start: ${this.x}, ${this.y}`);
        // console.log(`end: ${x}, ${y}`);
        // check if piece is on vertical or horizontal axes
        let dX = x - this.x;
        let dY = y - this.y;

        let absX = Math.abs(dX);
        let absY = Math.abs(dY);

        if (absX == 1 && absY == 2 || absX == 2 && absY == 1) {
            return {isValid: true};
        }

        // else the move is invalid
        return {isValid: false};
    }
}

class Bishop extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "bishop");
    }

    checkMove(x, y) {
        // console.log(`start: ${this.x}, ${this.y}`);
        // console.log(`end: ${x}, ${y}`);

        // check if piece is on diagonals
        let dX = x - this.x;
        let dY = y - this.y;

        if (Math.abs(dX) != Math.abs(dY)) {
            return {isValid: false};
        }

        // else the move is valid. find squares that have to be empty for move
        // to be valid
        let squares = [];

        let xDelta = dX > 0 ? 1 : -1;
        let yDelta = dY > 0 ? 1 : -1;

        for (let i = 1; i <= Math.abs(dX); i++) {
            squares.push([this.x + i * xDelta, this.y + i * yDelta]);
        }

        return {isValid: true, squares: squares};
    }
}

class Queen extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "queen");
    }

    checkMove(x, y) {
        // change in axes
        let dX = x - this.x;
        let dY = y - this.y;

        // horizontal or vertical moves would only affect one axis, so check 
        // if only one axis has changed
        let xMoved = dX != 0;
        let yMoved = dY != 0;
        if (xMoved != yMoved) {
            // the move is valid. find squares that have to be empty for move
            // to be valid
            let squares = [];

            let start = xMoved ? this.x : this.y;
            let end = xMoved ? x : y;
            let isPositive = end - start > 0;
            let delta = isPositive ? 1 : -1;

            for (let i = start + delta; i != end; i += delta) {
                squares.push([xMoved ? i : x, yMoved ? i : y]);
            }

            return {isValid: true, squares: squares};
        // check diagonals
        // the change in x and y should be equal for diagonal movement
        } else if (Math.abs(dX) == Math.abs(dY)) {
            let squares = [];

            let xDelta = dX > 0 ? 1 : -1;
            let yDelta = dY > 0 ? 1 : -1;

            for (let i = 1; i <= Math.abs(dX); i++) {
                squares.push([this.x + i * xDelta, this.y + i * yDelta]);
            }

            return {isValid: true, squares: squares};
        } 

        // else move is not on diagonals or vertical or horizontal axes
        // therefore it's invalid
        return {isValid: false};

    }
}

class King extends Piece {
    constructor(isBlack, x, y) {
        super(isBlack, x, y, "king");
    }

    checkMove(x, y) {
        let dX = x - this.x;
        let dY = y - this.y;

        let absX = Math.abs(dX);
        let absY = Math.abs(dY);

        // check for nearby square
        if (absX <= 1 && absY <= 1) {
            return {isValid: true, king: true};
        }
        // check for castle
            // TODO:
        // } else if ()
    }

    checkCheck(coords) {
        let x;
        let y;
        if (Object.hasOwn(coords, "x")) {
            x = this.x;
            y = this.y;
        } else {
            x = coords.x;
            y = coords.y;
        }

        let signs = [-1, 1];

        // check diagonals
        let diagonalSquares = [];
        for (const deltaY of signs) {
            let xSquare = x;
            let ySquare = y;
            for (const deltaX of signs) {
                while (0 <= xSquare && xSquare <= 7 && 0 <= ySquare && ySquare <= 7) {
                    xSquare += deltaX;
                    ySquare += deltaY;

                    diagonalSquares.push([xSquare, ySquare]);
                }
            }
        }

        this.checkForChecker(diagonalSquares, ["bishop", "queen"]);

        // check horiz & vert
        let orthogonalSquares = [];
        for (const deltaX of signs) {
            let xSquare = x;
            while (0 <= xSquare && xSquare <= 7) {
                xSquare += deltaX;

                orthogonalSquares.push(xSquare, y);
            }
        }
        for (const deltaY of signs) {
            let ySquare = y;
            while (0 <= ySquare && ySquare <= 7) {
                ySquare += deltaY;

                orthogonalSquares.push(x, ySquare);
            }
        }
        
        this.checkForChecker(orthogonalSquares, ["rook", "queen"]);

        // check for (roaring) knight
        let lengths = [1, 2];
        let knightSquares = [];
        for (const deltaY of signs) {
            for (const deltaX of signs) {
                let xSquare = x + deltaX * lengths[0];
                let ySquare = y + deltaY * lengths[1];
                knightSquares.push(xSquare, ySquare);

                xSquare = x + deltaX * lengths[1];
                ySquare = y + deltaY * lengths[0];
                knightSquares.push(xSquare, ySquare);
            }
        }

        this.checkForChecker(knightSquares, ["knight"]);

        // check for king
        // TODO:
    }

    checkForChecker(squares, pieces) {
        for (const s of squares) {
            let piece = board[s[0]][s[1]];
            if (piece !== null) {
                let name = piece.getName();
                for (const p of pieces) {
                    if (name == p) {
                        return true;
                    }
                }
            }
        }
    }
}
