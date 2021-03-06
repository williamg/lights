// GLOBAL VARIABLES
/* Defined in lights.js Included here for reference purposes
var startingGrid;
var solution;
var grid;
var cookies;
*/

var currentStep = 0;
var stepMoves = 0;
var lastStep = 6;

// Implementation
function nextStep() {
	currentStep++;
	showStep();
}

function prevStep() {
	console.log("here");
	currentStep--;
	showStep();
}

function bindUtilityButtons() {
	var resetBtn = document.getElementById("reset");
	resetBtn.addEventListener("click", function(evt) {
		ga('send', 'event', 'tutorial', 'reset', 'reset-step', currentStep);
		ga('send', 'event', 'tutorial', 'reset', 'reset-score', getNowScore());
		grid = reset(grid, startingGrid, stepMoves);
	}, false);

	var skipTutorial = document.getElementById("skip");
	skipTutorial.addEventListener("click", function(evt) {
		ga('send', 'event', 'tutorial', 'skipTutorial');
		setCookie("tutorial", "yes");
		window.location.href = "http://williamg.me/lights";
	}, false);
}

function changeInstructions(newInstructions) {
	var words = document.getElementById("tutorial");
	words.className = "hidden";
	setTimeout(function() {
		words.innerHTML = "";

		if(currentStep > 0)
			words.innerHTML += '<a id="back" href="#">Back</a> - ';

		words.innerHTML += newInstructions;

		if(currentStep == 0)
			words.innerHTML += ' - <a href="#" id="next">Next</a>';

		words.className = "";

		var back = document.getElementById("back");
		if(back)
			back.addEventListener("click", prevStep, false);

		var next = document.getElementById("next");
		if(next)
			next.addEventListener("click", nextStep, false);

	}, 200);
}

function countDirected(grid) {
	var count = 0;
	for(var x = 0; x < grid.size; x++) {
		for(var y = 0; y < grid.size; y++) {
			if(isDirected(grid.tiles[x][y]))
				count++;
		}
	}

	return count;
}

function showStep() {
	var instructions = undefined;
	var newGrid = undefined;

	switch(currentStep) {
		case 0:
			stepMoves = 0;
			newGrid = Grid(GRID_SIZE, 0);
			instructions = "The goal of the game is to turn on all the lights in as few clicks as possible."
			break;
		case 1:
			stepMoves = 3;
			instructions = "Most lights control themselves as well as the 4 adjacent lights. Try to solve the board above. The 'Reset' button can be used to return to the original board state if you make a mistake.";
			newGrid = Grid(GRID_SIZE, 0);
			toggle(newGrid, 2, 2);
			break;
		case 2:
			stepMoves = 5;
			instructions = "Corner and edge pieces only control adjacent tiles that are on the board.";
			newGrid = Grid(GRID_SIZE, 0);
			toggle(newGrid, 0, 0);
			toggle(newGrid, 4, 2);
			break;
		case 3:
			stepMoves = 16;
			instructions = "Here's an easy one to get started. It can be solved in only 4 clicks!";
			newGrid = Grid(GRID_SIZE, 0);
			unsolve(newGrid, 4);
			break;
		case 4:
			stepMoves = 16;
			instructions = "This one may be a bit more challenging. Be careful! You only have " + stepMoves + " moves before you have to start over!";
			newGrid = Grid(GRID_SIZE, 0);
			unsolve(newGrid, 6);
			break;
		case 5:
			stepMoves = 4;
			instructions = "Some lights are directed, and only control lights in certain directions, denoted by arrows.";
			newGrid = Grid(GRID_SIZE, 0);
			newGrid.tiles[0][2].right = false;
			newGrid.tiles[3][4].up = false;
			newGrid.tiles[3][4].left = false;
			toggle(newGrid, 0, 2);
			toggle(newGrid, 3, 4);
			break;
		case 6:
			stepMoves = 16;
			instructions = "This makes puzzles a bit more...interesting.";

			newGrid = Grid(GRID_SIZE, 0.15);
			while(countDirected(newGrid) < 3)
				newGrid = Grid(GRID_SIZE, 0.15);
			
			unsolve(newGrid, 4);
			break;
	}
	reset(grid, newGrid, stepMoves);
	listenForClicks();
	changeInstructions(instructions);
	displayGrid();
}

// Called when a move solves a board
function handleWin() {
	var tileDivs = document.getElementsByClassName("tile");
	for(var t = 0; t < tileDivs.length; t++) {
		tileDivs[t].className = "tile on";
		tileDivs[t].removeEventListener("click", handleClick, false);
	}

	fancyFlashEffect();
	if(currentStep != lastStep)
		setTimeout(nextStep, 1200);
	else {
		ga('send', 'event', 'tutorial', 'completeTutorial');
		var skip = document.getElementById("skip");
		skip.innerHTML = "Play Lights!";
		setCookie("tutorial", "yes");
		setTimeout(displayCompleteScreen, 1200);
	}
}

function displayCompleteScreen() {
	var overlay = document.getElementById("overlay");
	overlay.innerHTML = '';
	overlay.innerHTML += '<span>Tutorial complete!</span>\n';
	overlay.innerHTML += '<div id="button-wrapper">\n\t';
	overlay.innerHTML += '</div>';

	var wrapper = document.getElementById("button-wrapper");
	wrapper.innerHTML = '';

	wrapper.innerHTML += '<a href="http://williamg.me/lights" class="overlay-button">Play Lights!</a>\n';
	overlay.className = "";
}

function handleLoss() {
	ga('send', 'event', 'game', 'loss', 'loss');
	
	var overlay = document.getElementById("overlay");
	overlay.innerHTML = '';
	overlay.innerHTML += '<span>Try again!!</span>\n';
	overlay.innerHTML += '<div id="button-wrapper">\n\t';
	overlay.innerHTML += '</div>';

	var wrapper = document.getElementById("button-wrapper");
	wrapper.innerHTML = '<a id="playAgain" href="#" class="overlay-button">Retry!</a>\n';

	var replay = document.getElementById("playAgain");
	replay.addEventListener("click", function() {
		overlay.className = "hidden";
		reset(grid, startingGrid, stepMoves);
	}, false);

	overlay.className = "";
}

function handleReset() {
	listenForClicks();
	var overlay = document.getElementById("overlay");
	overlay.className = "hidden";
}

// We only want this page accessed via williamg.me/lights
if(window.location.href.indexOf("lights.williamg.me") >= 0)
	window.location.replace("http://williamg.me/lights/tutorial.html");

window.addEventListener("onbeforeunload", function() {
	ga('send', 'event', 'tutorial', 'leave', 'leave', currentStep);
}, false);

// Update cookie
for(var i = 0; i < cookies.length; i++)
	refreshCookie(cookies[i]);

// Set best score box
var bestScore = getCookie("bestScore");
if(bestScore === undefined) setBestScore("--");
else setBestScore(bestScore);

// Set up "Reset" and "Skip Tutorial" buttons
bindUtilityButtons();

showStep();
