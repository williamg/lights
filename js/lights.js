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
	var DIR_PROB = 0.50;

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

			// Start with an undirected light
			tile.up = tileUp;
			tile.right = tileRight;
			tile.down = tileDown;
			tile.left = tileLeft;

			// Randomize directions
			if(Math.random() < 0.5) {
				if(Math.random() < DIR_PROB) {
					tile.up = tile.down = tile.right = false;
					
					if(Math.random() < DIR_PROB)
						tile.right = tileRight;
				}
			} else {
				if(Math.random() < DIR_PROB) {
					tile.left = tile.right = tile.down = false;
				
					if(Math.random() < DIR_PROB)
						tile.down = tileDown;
				}
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
function isSolution(grid, solution) {
	// Create a copy of the grid. This feels dirty
	var gridCopy = JSON.parse(JSON.stringify(grid));

	for(var s = 0; s < solution.length; s++) {
		var x = solution[s].x;
		var y = solution[s].y;
		toggle(gridCopy, x, y);
	}

	for(var x = 0; x < gridCopy.size; x++) {
		for(var y = 0; y < gridCopy.size; y++) {
			if(!gridCopy.tiles[x][y].on) return false;
		}
	}

	return true;
}

// Implementation
function listenForClicks(grid) {
	var tiles = document.getElementsByClassName("tile");
	for(var t = 0; t < tiles.length; t++) {
		var tileDiv = tiles[t];
		tileDiv.addEventListener("click", function(evt) {
			handleClick(evt, grid);
		}, false);
	}
}

function handleClick(evt, grid) {
	var tileDiv = evt.target;
	var id = tileDiv.id;
	var index = parseInt(id.substr(1));

	var x = index % grid.size;
	var y = (index - x) / grid.size;
	toggle(grid, x, y);
	displayGrid(grid);
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

function unSolve(grid, numMoves) {
	var moves = [];

	for(var m = 0; m < numMoves; m++) {
		// Generate random place
		var x = Math.floor(Math.random() * grid.size);
		var y = Math.floor(Math.random() * grid.size);
		toggle(grid, x, y);

		moves[numMoves - m - 1] = {x: x, y: y};
	}

	return moves;
}

function displayGrid(grid) {
	var tiles = document.getElementsByClassName('tile');

	for(var t = 0; t < tiles.length; t++) {
		var x = t % grid.size;
		var y = (t - x) / grid.size;

		var tile = grid.tiles[x][y];
		var div = tiles[t];
		div.className = "tile";

		if(tile.on)
			div.className += " on";

		var tileUp = y > 0;
		var tileDown = y < grid.size - 1;
		var tileLeft = x > 0;
		var tileRight = x < grid.size - 1;

		// Determine if this is a directed tile or not (edges make this tricky)
		var undirected = (tileUp) ? tile.up : !tile.up;
		undirected = undirected && (tileRight) ? tile.right : !tile.right;
		undirected = undirected && (tileDown) ? tile.down : !tile.down;
		undirected = undirected && (tileLeft) ? tile.left : !tile.left
		if(undirected) continue;

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

var grid = Grid(5);
listenForClicks(grid);
var solution = unSolve(grid, 10);

if(!isSolution(grid, solution)) console.log("Error! Bad solution!");
console.log(solution);

displayGrid(grid);

