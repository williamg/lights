// GLOBAL VARIABLES
var GRID_SIZE = 5;
var SOLUTION_LENGTH = 17;
var DIR_PROB = 0.25;

var startingGrid;
var solution;
var grid;

// Define some objects
function Tile(x_, y_) {
	var tile = {
		pos: {
			x: x_,
			y: y_
		},
		on: true,
		up: false,
		right: false,
		down: false,
		left: false,
	};
	
	return tile;
}

// Generate a random grid
function Grid(size) {
	// Initialize a random directed graph
	var tiles = [];

	for(var x = 0; x < size; x++) {
		tiles[x] = [];

		for(var y = 0; y < size; y++) {
			var tile = Tile(x, y);

			var tileUp = y > 0;
			var tileDown = y < size - 1;
			var tileLeft = x > 0;
			var tileRight = x < size - 1;

			// Randomize directions
			// Tiles can only control the lights on the left/right OR up/down
			// This is exclusively for design reasons. Too many different directions
			// looks cluttered.
			if(Math.random() < 0.5) {
				if(tileLeft && Math.random() < DIR_PROB)
					tile.left = true;

				if(tileRight && Math.random() < DIR_PROB)
					tile.right = true;
			} else {
				if(tileUp && Math.random() < DIR_PROB)
					tile.up = true;

				if(tileDown && Math.random() < DIR_PROB)
					tile.down = true;
			}

			// If we didn't assign any directions, then it's a normal lights and
			// controls all 4 adjacent tiles
			if(!tile.up && !tile.down && !tile.left && !tile.right) {
				tile.up = tileUp;
				tile.right = tileRight;
				tile.down = tileDown;
				tile.left = tileLeft;
			}

			tiles[x][y] = tile;
		}
	}
	
	var grid = {
		tiles: tiles,
		size: size
	};

	return grid;
}

// Utility functions
function isSolution(solution) {
	var gridCopy = copyGrid(grid);

	for(var s = 0; s < solution.length; s++) {
		var x = solution[s].x;
		var y = solution[s].y;
		toggle(gridCopy, x, y);
	}
	return isSolved(gridCopy);
}

function isSolved(grid) {
	for(var x = 0; x < grid.size; x++) {
		for(var y = 0; y < grid.size; y++) {
			if(!grid.tiles[x][y].on) return false;
		}
	}

	return true;
}

function isDirected(tile, size) {
	var tileUp = tile.pos.y > 0;
	var tileDown = tile.pos.y < size - 1;
	var tileLeft = tile.pos.x > 0;
	var tileRight = tile.pos.x < size - 1;

	var undirected = (tileUp) ? tile.up : true;
	undirected = undirected && ((tileRight) ? tile.right : true);
	undirected = undirected && ((tileDown) ? tile.down : true);
	undirected = undirected && ((tileLeft) ? tile.left : true);

	return !undirected;
}

function getBestScore() {
	var bestScore = document.getElementById("best-score");
	var score = parseInt(bestScore.innerHTML.substr(18));
	return score;

}

function setBestScore(score) {
	var bestScore = document.getElementById("best-score");
	bestScore.innerHTML = "<span>Best:</span>" + score;
}

function getNowScore() {
	var nowScore = document.getElementById("now-score");
	var score = parseInt(nowScore.innerHTML.substr(17));
	return score;
}

function setNowScore(score) {
	var nowScore = document.getElementById("now-score");
	nowScore.innerHTML = "<span>Now:</span>" + score;
}

function copyGrid(grid) {
	// This is dirty
	return JSON.parse(JSON.stringify(grid));
}

// COOOOOOOOOKIE crisp
function getBestScoreCookie() {
	// Assuming we only store one cookie
	var ca = document.cookie.split(";");
	var bestScoreStr = "bestScore=";
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while(c.charAt(0) == ' ') c = c.substring(1);
		if(c.indexOf(bestScoreStr) == 0)  {
			var scoreStr = c.substr(bestScoreStr.length);
			var score = parseInt(scoreStr);
			return score;
		}
	}

	return Math.NaN;
}

function setBestScoreCookie(bestScore) {
	var d = new Date();
	d.setTime(d.getTime() + (100 * 24 * 60 * 60 * 1000));
	document.cookie = "bestScore=" + bestScore + "; expires=" + d.toUTCString();
}

// Implementation
var handleClickWrapper = function(grid) {
	return function(evt) {
		handleClick(evt, grid);
	}
}
function listenForClicks(grid) {
	var tiles = document.getElementsByClassName("tile");
	for(var t = 0; t < tiles.length; t++) {
		var tileDiv = tiles[t];
		tileDiv.addEventListener("click", handleClick, false);
	}
}

function bindUtilityButtons() {
	var resetBtn = document.getElementById("reset");
	resetBtn.addEventListener("click", function(evt) {
		grid = reset(grid, startingGrid);
	}, false);

	var newGridBtn = document.getElementById("new");
	newGridBtn.addEventListener("click", function(evt) {
		grid = reset(grid);
	}, false);
}

function handleClick(evt) {
	var tileDiv = evt.target;
	var id = tileDiv.id;
	var index = parseInt(id.substr(1));

	var x = index % grid.size;
	var y = (index - x) / grid.size;
	toggle(grid, x, y);
	displayGrid(grid);

	// Update score
	setNowScore(getNowScore() + 1);

	if(isSolved(grid)) {
		// Delayed to let animations finish
		setTimeout(function() {
			handleWin();
		}, 200);
	}
}

function handleWin() {
	var tileDivs = document.getElementsByClassName("tile");
	for(var t = 0; t < tileDivs.length; t++) {
		tileDivs[t].className = "tile on";
		tileDivs[t].removeEventListener("click", handleClick, false);
	}

	fancyFlashEffect();
	setTimeout(displayWinTiles, 1200);

	var bestScore = getBestScoreCookie();
	var nowScore = getNowScore();
	if (isNaN(bestScore) || nowScore < bestScore) {
		setBestScore(nowScore);
		setBestScoreCookie(nowScore);
	}
}

function offon(tile) {
	tile.className = "tile";

	setTimeout(function() {
		tile.className = "tile on";
	}, 200);
}

function fancyFlashEffect() {
	var tileDivs = document.getElementsByClassName("tile");

	for(var y = 0; y < 4*GRID_SIZE; y++) {
		(function(y) {
			setTimeout(function() {
				var boundedY = y % (2 * GRID_SIZE);
				for(var ty = boundedY; ty >= 0; ty--) {
					var tx = boundedY - ty;
					var index = ty * GRID_SIZE + tx;

					if(index >= 0 && index < GRID_SIZE * GRID_SIZE - 1)
						offon(tileDivs[index]);
				}
			}, y * 50);
		})(y);
	}
}

function facebookListener () {
	var url = "https://facebook.com/dialog/feed?";
	var appID = "774394885948709";
	var link = "http://lights.williamg.me";
	var picture = "http://williamg.github.io/lights/style/lights.png"
	var name = "Play lights!";
	var description = "I turned on all the lights in only " + getNowScore() + " moves! Can you beat me?";
	url += "app_id=" + appID;
	url += "&redirect_uri=" + link;
	url += "&description=" + description;
	url += "&link=" + link;
	url += "&picture=" + picture;
	url += "&name=" + name;

	window.open(encodeURI(url));
}

function twitterListener() {
	var url = "https://twitter.com/share?"
	var link = "http://lights.williamg.me";
	var text = "I turned on all the lights in only " + getNowScore() + " moves! Can you beat me%3F";
	url += "url=" + link;
	url += "&text=" + text;

	window.open(encodeURI(url));
}

function displayWinTiles() {
	var tileDivs = document.getElementsByClassName("tile");
	tileDivs[6].innerHTML = "Y";
	tileDivs[7].innerHTML = "O";
	tileDivs[8].innerHTML = "U";
	tileDivs[11].innerHTML = "W";
	tileDivs[12].innerHTML = "I";
	tileDivs[13].innerHTML = "N";
	tileDivs[16].className += " twitter";
	tileDivs[18].className += " facebook";

	var facebook = tileDivs[18];
	facebook.addEventListener("click", facebookListener, false);

	var twitter = tileDivs[16];
	twitter.addEventListener("click", twitterListener, false);
}

function toggle(grid, x, y) {
	if(x < 0 || x >= grid.size || y < 0 || y >= grid.size) {
		console.log("ERROR: Coordinates (" + x + ", " + y + ") out of bounds!");
		return;
	}

	var tile = grid.tiles[x][y];
	tile.on = !tile.on;

	if(tile.left) {
		var left = grid.tiles[x-1][y];
		left.on = !left.on;
	}

	if(tile.right) {
		var right = grid.tiles[x+1][y];
		right.on = !right.on;
	}

	if(tile.up) {
		var up = grid.tiles[x][y-1];
		up.on = !up.on;
	}

	if(tile.down) {
		var down = grid.tiles[x][y+1];
		down.on = !down.on;
	}
}

function unSolve(numMoves) {
	var moves = [];
	var choices = [];

	for(var c = 0; c < GRID_SIZE * GRID_SIZE; c++)
		choices.push(c);

	for(var m = 0; m < numMoves; m++) {
		// Generate random place
		var index = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE - m));
		var tile = choices.splice(index, 1);
		var x = tile % GRID_SIZE;
		var y = (tile - x) / GRID_SIZE;
		toggle(grid, x, y);

		moves[numMoves - m - 1] = {x: x, y: y};
	}

	return moves;
}

function displayGrid() {
	var tiles = document.getElementsByClassName('tile');

	for(var t = 0; t < tiles.length; t++) {
		var x = t % grid.size;
		var y = (t - x) / grid.size;

		var tile = grid.tiles[x][y];
		var div = tiles[t];
		div.className = "tile";
		div.innerHTML = "";

		if(tile.on)
			div.className += " on";

		// Determine if this is a directed tile or not (edges make this tricky)
		if(!isDirected(tile, grid.size)) continue;

		if(tile.left)
			div.className += " left";
		if(tile.right)
			div.className += " right";
		if(tile.up)
			div.className += " up";
		if(tile.down)
			div.className += " down";
	}
}

function reset(oldGrid, newGrid) {
	grid = newGrid;
	
	if(grid == undefined) {
		grid = Grid(GRID_SIZE);
		solution = unSolve(SOLUTION_LENGTH);

		// Sanity check
		if(!isSolution(solution)) console.log("Error! Bad solution!");
	}

	listenForClicks();
	
	var tileDivs = document.getElementsByClassName('tile');
	
	for(var t = 0; t < tileDivs.length; t++) {
		var x = t % grid.size;
		var y = (t - x) / grid.size;

		if(oldGrid == undefined || !oldGrid.tiles[x][y].on) {
			tileDivs[t].className += " on";
		}
	}

	var facebook = tileDivs[18];
	facebook.removeEventListener("click", facebookListener, false);

	var twitter = tileDivs[16];
	twitter.removeEventListener("click", twitterListener, false);


	setNowScore(0);
	setTimeout(displayGrid.bind(this, grid), 200);
	startingGrid = copyGrid(grid);
	return grid;
}

// Update cookie
var bestScore = getBestScoreCookie();
setBestScoreCookie(bestScore);

// Set best score box
if(isNaN(bestScore)) setBestScore("--");
else setBestScore(bestScore);

// Set up "Reset" and "New Grid" buttons
bindUtilityButtons();

// Generate and display the grid
grid = reset();
