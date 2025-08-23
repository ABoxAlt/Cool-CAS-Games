const cards = [];
const scoreLabel = document.querySelector("#score");
const bestScoreLabel = document.querySelector("#bestScore");

let cardsData = [];
let revealedCards = [];
let checkCards = [];
let game = false;

let moves = 0;
let bestMoves = 0;



for (const card of document.querySelectorAll(".card")) {
    cards.push(card);
}

addEventListener("click", onClick);

function revealCard(e) {
    e.srcElement.innerText = cardsData[cards.indexOf(e.srcElement)];
    return cards.indexOf(e.srcElement);
}

function resetCards() {
    for (const card of cards) {
        if (!revealedCards.includes(cards.indexOf(card))) {
            card.innerText = "X";
        }
    }
}

function checkWin() {
    for (const card of cards) {
        if (revealedCards.length != 36) {
            console.log("Not Won");
            return;
        }
    }
    console.log("Won!");
    if (bestMoves == 0 || bestMoves > moves) {
        bestMoves = moves;
        bestScoreLabel.textContent = "Best Moves : " + bestMoves;
    }
    game = false;
}

function onClick(e) {
    if (e.srcElement.className == "reset") {
        console.log("reset game");
        gameStart();
    }if (e.srcElement.className == "card" && e.srcElement.innerText == "X" && game) {
        if (checkCards.length == 0) {
            checkCards.push(revealCard(e));
            moves ++;

        } else if (checkCards.length == 1) {
            checkCards.push(revealCard(e));
            moves ++;
            if (cardsData[checkCards[0]] == cardsData[checkCards[1]]) {
                revealedCards.push(...checkCards);
                checkWin();
            }
        } else if (checkCards.length == 2) {
            checkCards = [];
            resetCards();
            checkCards.push(revealCard(e));
            moves ++;
        }
        scoreLabel.textContent = "Moves : " + moves;
    } else if (!game && e.srcElement.className == "card") {
        console.log("Game Won, press the reset button");
    }
}

function random(max) {
    return Math.floor(Math.random() * max);
}



function gameStart() {
    game = true;
    cardsData = [];
    revealedCards = [];
    checkCards = [];
    score = 0;
    resetCards();
    for (let i = 0; i < 18; i++) {
        for (let idx = 0; idx < 2; idx++) {
            while (true) {
                let cardIndex = random(36);
                if (cards[cardIndex].innerText == "X") {
                    cards[cardIndex].innerText = i;
                    break;
                }
            }
        }
    }

    for (const card of cards) {
        cardsData.push(card.innerText);
        card.innerText = "X";
    }
}


gameStart();