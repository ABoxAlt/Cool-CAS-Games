let facts = [ // setting facts as "let", because const makes it so its unable to change it back
    "51 is divisible by 17 and 3.",
    "In 1492, Columbus sailed the ocean blue and discovered the Americas.",
    "The Doppler Effect describes the change in frequency of a wave when the observer or source or both of a wave are moving.",
    "Cheetas can run 60 mph.",
    "The knife blade typically faces towards the plate",
    "The typically american eats dinner at 5:07 PM - 8:19 PM",
    "Your brain takes 20 minutes to register that your full",
    "In france dinner usually lasts 2 to 3 hours and its considered rude to ask for a subsitution to your meal",
    "Smell is responsible for up to 80% of what we taste",
    "You can cook your dinner using a dishwasher",
    "The average human spends 1.5 years just eating dinner",
    "Food taste different on planes as the air dulls your senses up to 30%",
    "Tuesday statistically are the least popular day to eat out for americans",
    "A single spaghetti is called a spaghetto",
    "Eating cheese before you sleep is said to give you pleasant dreams",
    "The caesar salad wasn’t created in italy rather in mexico",
    "Most wasabi isn’t real wasabi most times it’s died horseradish",
    "In some cultures burping during dinner is a compliment"
]

const recycle = facts; // this sets recycle as the same as facts 

function getRandomInt(max) {
    return Math.floor(Math.random() * 3);
}

const label = document.getElementById("dinnerFact");
function getFact() {
    let label = document.getElementById("dinnerFact");
    playAudio();
    // All I did here Void was change the fact display code so the website wont display the same fact twice
    // you can still reload the site to see them again
    if (facts.length > 0) {
        let fact = facts.splice(facts.indexOf(facts[getRandomInt(facts.max)]), 1);
        label.textContent = "Dinner Fact: " + fact;
    } else {
        // NEED WORK ON THIS (basically you set the facts array equal to the backup so, in theory, itll reset back to the original array)
        facts = recycle;
        
        //label.textContent = "Dinner Fact: You've seen all the facts!";
    }
}

function playAudio() {
    let x = new Audio("./splat.mp3");
    x.volume = 0.2;
    x.play();
}