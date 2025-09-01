const facts = [ // use const since facts will always be the same array
    "51 is divisible by 17 and 3.",
    "In 1492, Columbus sailed the ocean blue and discovered the Americas.",
    "The Doppler Effect describes the change in frequency of a wave when the observer or source or both of a wave are moving.",
    "Cheetahs can run 60 mph.",
    "The knife blade typically faces towards the plate.",
    "The typical American eats dinner at 5:07 PM - 8:19 PM.",
    "Your brain takes 20 minutes to register that you're full.",
    "In France, dinner usually lasts 2 to 3 hours and it's considered rude to ask for a subsitution to your meal.",
    "Smell is responsible for up to 80% of what we taste.",
    "You can cook your dinner using a dishwasher.",
    "The average human spends 1.5 years just eating dinner.",
    "Food tastes different on planes as the air dulls your senses up to 30%.",
    "Tuesday statistically are the least popular day to eat out for Americans.",
    "A single spaghetti is called a spaghetto.",
    "Eating cheese before you sleep is said to give you pleasant dreams.",
    "The caesar salad wasn't created in Italy but rather in Mexico.",
    "Most wasabi isn't real wasabi. Most times, it's dried horseradish.",
    "In some cultures burping during dinner is a compliment."
];

// track which facts we've shown
let pointer = 0;

// pre-shuffle the array to ensure different facts every time
window.onload = () => shuffle(facts);

const label = document.getElementById("dinnerFact");
const buttonImg = document.getElementById("factButton");

addEventListener("mousedown", md);
addEventListener("mouseup", mu);
function md() {
    buttonImg.src = "../../images/buttonFact_Clicked.png";
} 
function mu() {
    buttonImg.src = "../../images/buttonFact.png";
}

function getFact() {
    playAudio();

    // ABox, I changed the code to pick all the facts and then shuffle the list
    // then rinse and repeat. it won't show the same fact twice
    // the other implementation didn't work since recycle was a shallow copy of
    // facts, and since they referenced the same array once facts became empty
    // so did recycle so facts tried to copy its own empty contents
    let fact = facts[pointer];
    label.textContent = "Dinner Fact: " + fact;

    // increment to remember we've shown that fact already
    pointer++;
    // when we run out of facts, shuffle and show facts again
    if (pointer >= facts.length) {
        shuffle(facts);
        pointer = 0;
    }
}

// return an integer from 0 inclusive to max exclusive
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// randomize the order of an array in place using the fisher-yates algorithm
function shuffle(arr) {
    for (let i = 0; i < arr.length - 2; i++) {
        // swap elements to randomize the order
        let idx = getRandomInt(arr.length);
        let temp = arr[idx];
        arr[idx] = arr[i];
        arr[i] = temp;
    }
}

function playAudio() {
    let x = new Audio("./splat.mp3");
    x.volume = 0.2;
    x.play();
}