//This just selects the html element of the canvas to adjust with javascript
const canvas = document.querySelector(".gameCanvas");

//This lets us draw things on the canvas
const ctx = canvas.getContext("2d");

// select p and button tags to work with then in code
const alertLabel = document.getElementById("alertLabel");
const turnLabel = document.getElementById("turnLabel");
const resignButton = document.getElementById("resignButton");
const drawButton = document.getElementById("drawButton");

//This adds an event for when the mouse is pressed down, events aren't great for a lot of games
//but they work fine for tic tac toe since you are just selecting options
//they're usually bad since they stop everything to run the event
canvas.addEventListener("mouseup", onMouseUp);
resignButton.addEventListener("mouseup", resignButton_onMouseUp);
drawButton.addEventListener("mouseup", drawButton_onMouseUp);

const GameState = Object.freeze({
    SELECT: 0,
    MOVE: 1,
    PROMOTE: 2,
    END: 3
});
const CHESS_IMAGES = {};
const CELL_SIZE = canvas.width / 8;
const LIGHT_COLOR = "rgba(174, 182, 255, 1)";
const DARK_COLOR = "rgba(136, 148, 255, 1)";
const allPieces = [];
const PROMOTE_PIECES = [
    "knight",
    "bishop",
    "rook",
    "queen"
];

let board;

let turn;
let turnIsBlack;
let state;
let selectedPiece;


//Outputs the mouse coordinates (based on the canvas not the webpage)
function onMouseUp(e) {
    switch (state) {
        case GameState.SELECT: {
            const [x, y] = getMousePos(e);
            selectedPiece = board[y][x];

            // check if a piece was clicked
            if (selectedPiece === null)
                return;

            // check if piece is right color
            if (selectedPiece.getIsBlack() !== turnIsBlack)
                return;

            // else
            state = GameState.MOVE;
            ctx.save();
            ctx.strokeColor = "white";
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            ctx.restore();
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
            if (endPosPiece !== null && endPosPiece.isBlack === selectedPiece.isBlack) {
                cancelMove("One of your pieces is already on that square. Cancelled move.");
                return;
            }

            // check for pawn promotion
            if (selectedPiece.getName() === "pawn" && (selectedPiece.isBlack && y === 0 || !selectedPiece.isBlack && y === 7)) {
                //TODO:
                state = GameState.PROMOTE;
                drawPromotion(x);
            }

            // check if king in check
            if (Object.hasOwn(response, "king") && selectedPiece.checkCheck([x, y])) {
                return;
            }

            // check for castle
            if (Object.hasOwn(response, "castle")) {
                let dX = x - this.x;
                let directionX = dX > 0 ? 1 : -1;
                for (let i = 1; i <= 2; i++) {
                    if (selectedPiece.checkCheck([selectedPiece.getX() + i * directionX, y])) {
                        return;
                    }
                }
            }

            // check if pawn can capture
            if (Object.hasOwn(response, "capture") && board[y][x] == null) {
                return;
            }

            console.log("valid move");

            // update the turns
            if (turnIsBlack === true)
                turn++;

            // change whose turn it is
            turnIsBlack = !turnIsBlack;

            let turnStr = turn.toString();
            let color = turnIsBlack ? "BLACK" : "WHITE";
            turnLabel.textContent = `Turn ${turnStr}: ${color} to move!`;

            // update board
            // check capture
            if (endPosPiece !== null) {
                board[y][x] = null;
                endPosPiece = null;
            }
            console.log(endPosPiece);

            // move 
            board[y][x] = selectedPiece;
            selectedPiece.move(x, y);

            drawBoard();

            // if (checkWin()) {
            //     alertLabel.textContent = "You won! Click the board to play again!";
            //     state = GameState.END;
            // }
            state = GameState.SELECT;
            break;
        }
        case GameState.PROMOTE: {
            const [x, y] = getMousePos(e);
            let isBlack = selectedPiece.getIsBlack();
            let pieceX = selectedPiece.getX();
            let pieceY = selectedPiece.getY();
            for (const [i, name] of PROMOTE_PIECES.entries()) {
                let buttonY = (isBlack ? 0 : 7) + (isBlack ? 1 : -1) * i;
                if (x === pieceX && y === buttonY) {
                    // remove original pawn
                    board[y][x] = null;
                    selectedPiece = null;

                    board[y][x] = pieceFromName(name, isBlack, pieceX, pieceY);
                    
                    state = GameState.SELECT;
                    drawBoard();
                //     if (checkWin()) {
                //         alertLabel.textContent = "You won! Click the board to play again!";
                //         state = GameState.END;
                //     }
                }
            }

            break;
        }
        case GameState.END: {
            state = GameState.SELECT;
            newGame();
            break;
        }
        default:
            console.log("ERROR: state unset??");
            break;
    }
}

// TODO: use removePiece in place of direct board mutation
function removePiece(x, y) {
    // remove from allPieces
    for (let i = 0; i < allPieces.length; i++) {
        if (allPieces[i] === board[y][x]) {
            allPieces.splice(i, 1);
        }
    }
    board[y][x] = null;
}

function resignButton_onMouseUp() {
    // end game
    state = GameState.END;

    // if it's black's turn and they resign, then white wins, so do the
    // opposite of what the variable indicates
    let color = turnIsBlack ? "WHITE" : "BLACK";
    alertLabel.textContent = `${color} WON in ${turn} moves! Click the board to play again.`;
}

function drawButton_onMouseUp() {

}

function pieceFromName(n, isBlack, pieceX, pieceY) {
    switch (name) {
        case "knight":
            return Knight(isBlack, pieceX, pieceY);
        case "bishop":
            return Bishop(isBlack, pieceX, pieceY);
        case "rook":
            return Rook(isBlack, pieceX, pieceY);
        case "queen":
            return Queen(isBlack, pieceX, pieceY);
    }
}

function drawPromotion(x) {
    ctx.save();

    // set colors
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";

    let isBlack = selectedPiece.getIsBlack();

    // draw promotion selector popup one away from the top & bottom rows
    ctx.fillRect(
        x * CELL_SIZE,
        (isBlack ? 1 : 3) * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE * 4 // 4 pieces we can promote to: rook, knight, bishop, queen
    );

    // draw border around selectedPiece
    ctx.strokeRect(
        x * CELL_SIZE,
        (isBlack ? 0 : 7) * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
    );
    ctx.fillRect(
        x * CELL_SIZE,
        (isBlack ? 0 : 7) * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
    );

    // draw promote opts
    for (const [i, name] of PROMOTE_PIECES.entries()) {
        let color = isBlack ? "black" : "white";
        let img = CHESS_IMAGES[`${name}_${color}.png`];
        let y = (isBlack ? 0 : 7) + (isBlack ? 1 : -1) * i;
        ctx.drawImage(img, x, y, CELL_SIZE, CELL_SIZE);
    }

    // draw selected piece
    let img = CHESS_IMAGES[selectedPiece.getSpriteName()]; 
    let y = isBlack ? 0 : 7;
    ctx.drawImage(img, x, y, CELL_SIZE, CELL_SIZE);

    ctx.restore();
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

// this function would take too long to implement, so we're going to move 
// forward with using buttons to end the game until a later date
// function checkWin() {
//     // TODO:
//     return false;
// }

// TODO: separate into 2 func, draw background board & draw pieces
function drawBoard() {
    //This sets the background
    //ctx.save saves any changes made to css so it can be restored after these actions
    ctx.save();
    //fillStyle is the color
    ctx.fillStyle = LIGHT_COLOR;
    //fillRect needs x y coordinates and then a width and height
    //the x y coordinates pretain to the top left corner of the rectangle
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw chess board
    ctx.fillStyle = DARK_COLOR;
    // loop thru rows & cols
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 4; x++) {
            ctx.fillRect(
                x * CELL_SIZE * 2 + (y + 1) % 2 * CELL_SIZE, // alternate cells
                y * CELL_SIZE,
                CELL_SIZE, // same width & height to make square
                CELL_SIZE
            );
        }
    }

    // TEST:  check img loaded
    // for (const [filename, img] of Object.entries(CHESS_IMAGES)) {
    //     console.log(`${filename}: ${img.complete && img.naturalWidth !== 0 ? "Success" : "Failure"}`);
    // }

    // draw pieces
    // console.log(allPieces);
    allPieces.forEach(element => {
        // console.log("foreach");
        element.draw();
    });

    ctx.restore();
}

async function gameStart() {
    await loadImages();
    newGame();
}

function newGame() {
    board = createBoard();

    // init vars
    turn = 0;
    turnIsBlack = false;
    state = GameState.SELECT;
    selectedPiece = null;

    // draw ui
    // console.log("drawBoard");
    drawBoard();
    alertLabel.textContent = "GAME START! Select any piece to begin.";
    let turnStr = turn.toString();
    let color = turnIsBlack ? "BLACK" : "WHITE";
    turnLabel.textContent = `Turn ${turnStr}: ${color} to move!`;
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
            allPieces.push(piece);
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
            this.x * CELL_SIZE,
            this.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
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

    getName() {
        return this.name;
    }

    getIsBlack() {
        return this.isBlack;
    }

    getSpriteName() {
        return this.spriteName;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
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
        } else if (!this.hasMoved && absY == 2) {
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
    hasMoved = false;

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
        // check for castle kingside
        } else if (!this.hasMoved && absY == 0 && absX == 2) {
            // let deltaX = dX > 0 ? 1 : -1;
            return {isValid: true, castle: true};
        }
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
        };

        if (this.checkForChecker(diagonalSquares, ["bishop", "queen"])) {
            return true;
        }

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

        if (this.checkForChecker(orthogonalSquares, ["rook", "queen"])) {
            return true;
        }

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

        if (this.checkForChecker(knightSquares, ["knight"])) {
            return true;
        }

        // check for king
        let nums = [-1, 0, 1];
        let kingSquares = [];
        for (const deltaY of nums) {
            for (const deltaX of nums) {
                if (y == 0 && x == 0) {
                    continue;
                }
                let xSquare = x + deltaX;
                let ySquare = y + deltaY;
                if (0 <= xSquare && xSquare <= 7 && 0 <= ySquare && ySquare <= 7) {
                    kingSquares.push([xSquare, ySquare]);
                }
            }
        }

        if (this.checkForChecker(kingSquares, ["king"])) {
            return true;
        }

        // check for pawns
        let yDelta = this.isBlack ? 1 : -1;
        let pawnSquares = [];
        for (const xDelta of signs) {
            let xSquare = x + xDelta;
            let ySquare = y + yDelta;

            if (0 <= xSquare && xSquare <= 7 && 0 <= ySquare && ySquare <= 7) {
                kingSquares.push([xSquare, ySquare]);
            }
        }

        if (this.checkForChecker(pawnSquares, ["pawn"])) {
            return true;
        }

        // else
        return false;
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
