const facts = [
    "51 is divisible by 17 and 3.",
    "In 1492, Columbus sailed the ocean blue and discovered the Americas.",
    "The Doppler Effect describes the change in frequency of a wave when the observer or source or both of a wave are moving."
]

function getRandomInt(max) {
    return Math.floor(Math.random() * 3);
}

function getFact() {
    let label = document.getElementById("dinnerFact");
    label.textContent = "Dinner Fact: " + facts[getRandomInt(facts.max)];
}