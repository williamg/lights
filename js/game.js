// GLOBAL VARIABLES
/* Defined in lights.js Included here for reference purposes
var startingGrid;
var solution;
var grid;
*/

// Implementation
function bindUtilityButtons() {
	var resetBtn = document.getElementById("reset");
	resetBtn.addEventListener("click", function(evt) {
		ga('send', 'event', 'game', 'reset', 'reset', getNowScore());
		grid = reset(grid, startingGrid);
	}, false);

	var newGridBtn = document.getElementById("new");
	newGridBtn.addEventListener("click", function(evt) {
		ga('send', 'event', 'game', 'newBoard', 'newBoard', getNowScore());
		grid = reset(grid);
	}, false);
}

// Called when a move solves a board
function handleWin() {
	ga('send', 'event', 'game', 'win', 'win', getNowScore());
	var tileDivs = document.getElementsByClassName("tile");
	for(var t = 0; t < tileDivs.length; t++) {
		tileDivs[t].className = "tile on";
		tileDivs[t].removeEventListener("click", handleClick, false);
	}

	fancyFlashEffect();
	setTimeout(displayWinTiles, 1200);

	var bestScore = getCookie("bestScore");
	var nowScore = getNowScore();
	if (isNaN(bestScore) || nowScore < bestScore) {
		setBestScore(nowScore);
		setCookie("bestScore", nowScore);
	}
}

function facebookListener () {
	var url = "https://facebook.com/dialog/feed?";
	var appID = "774394885948709";
	var link = "http://williamg.me/lights";
	var picture = "http://williamg.github.io/lights/style/lights.png"
	var name = "Play lights!";
	var description = "I turned on all the lights in only " + getNowScore() + " moves! Can you beat me?";
	description = encodeURIComponent(description);
	url += "app_id=" + appID;
	url += "&redirect_uri=http://facebook.com";
	url += "&description=" + description;
	url += "&link=" + link;
	url += "&picture=" + picture;
	url += "&name=" + name;

	window.open(url);
}

function twitterListener() {
	var url = "https://twitter.com/share?"
	var link = "http://williamg.me/lights";
	var text = "I turned on all the lights in only " + getNowScore() + " moves! Can you beat me?";
	text = encodeURIComponent(text);
	url += "text=" + text;
	url += "&url=" + link;

	window.open(url);
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

function handleReset() {
	var tileDivs = document.getElementsByClassName("tile");
	var facebook = tileDivs[18];
	facebook.removeEventListener("click", facebookListener, false);

	var twitter = tileDivs[16];
	twitter.removeEventListener("click", twitterListener, false);

	listenForClicks();
}

// We only want this page accessed via williamg.me/lights
if(window.location.href.indexOf("lights.williamg.me") >= 0)
	window.location.replace("http://williamg.me/lights");

window.addEventListener("onbeforeunload", function() {
	if(!isSolved(grid))
		ga('send', 'event', 'tutorial', 'leaveBeforeWin', 'leaveBeforeWin', getNowScore());
}, false);

// Update cookie
for(var i = 0; i < cookies.length; i++)
	refreshCookie(cookies[i]);

// Set best score box
var bestScore = getCookie("bestScore");
if(bestScore === undefined) setBestScore("--");
else setBestScore(bestScore);

var tutorial = getCookie("tutorial");
if((tutorial == "no" || tutorial === undefined) && bestScore === undefined) {
	window.location.href = "http://williamg.me/lights/tutorial.html";
} else {
	setCookie("tutorial", "yes");
}

// Set up "Reset" and "New Grid" buttons
bindUtilityButtons();

// Generate and display the grid
grid = reset();
