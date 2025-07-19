//This just selects the html element of the canvas to adjust with javascript
const gameCanvas = document.querySelector(".gameCanvas");
//This adds an event for when the mouse is pressed down, events aren't great for a lot of games
//but they work fine for tic tac toe since you are just selecting options
//they're usually bad since they stop everything to run the event
gameCanvas.addEventListener("mouseup", onMouseUp);

//Outputs the mouse coordinates (based on the canvas not the webpage)
function onMouseUp(e) {
    console.log(e.offsetX, e.offsetY);
}