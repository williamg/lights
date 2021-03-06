// GLOBAL VARIABLES
/* Defined in lights.js Included here for reference purposes
var startingGrid;
var solution;
var grid;
*/

var MAX_MOVES = 30;

// Implementation
function bindUtilityButtons() {
	var resetBtn = document.getElementById("reset");
	resetBtn.addEventListener("click", function(evt) {
		ga('send', 'event', 'game', 'reset', 'reset', getNowScore());
		grid = reset(grid, startingGrid, MAX_MOVES);
	}, false);

	var newGridBtn = document.getElementById("new");
	newGridBtn.addEventListener("click", function(evt) {
		ga('send', 'event', 'game', 'newBoard', 'newBoard', getNowScore());
		grid = reset(grid, undefined, MAX_MOVES);

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
	setTimeout(displayWinScreen, 1200);

	var bestScore = getCookie("bestScore");
	var nowScore = getNowScore();
	if (isNaN(bestScore) || nowScore > bestScore) {
		setBestScore(nowScore);
		setCookie("bestScore", nowScore);
	}
}

function facebookURL () {
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
	return url;
}

function twitterURL() {
	var url = "https://twitter.com/share?"
	var link = "http://williamg.me/lights";
	var text = "I turned on all the lights in only " + getNowScore() + " moves! Can you beat me?";
	text = encodeURIComponent(text);
	url += "text=" + text;
	url += "&url=" + link;
	return url;
}

function displayWinScreen() {
	var overlay = document.getElementById("overlay");
	overlay.innerHTML = '';
	overlay.innerHTML += '<span>You win!</span>\n';
	overlay.innerHTML += '<div id="button-wrapper">\n\t';
	overlay.innerHTML += '</div>';

	var wrapper = document.getElementById("button-wrapper");
	wrapper.innerHTML = '';

	wrapper.innerHTML += '<a target="_blank" id="facebook" href="' + facebookURL() + '" class="overlay-button">Share on Facebook</a>\n\t';
	wrapper.innerHTML += '<a target="_blank" id="twitter" href="' + twitterURL() + '" class="overlay-button">Share on Twitter</a>\n\t';
	wrapper.innerHTML += '<a id="playAgain" href="#" class="overlay-button">Play Again!</a>\n';

	var facebook = document.getElementById("facebook");
	facebook.addEventListener("click", function() {
		ga('send', 'event', 'social', 'facbeook');
	}, false);

	var twitter = document.getElementById("twitter");
	twitter.addEventListener("click", function() {
		ga('send', 'event', 'social', 'twitter');
	}, false);

	var replay = document.getElementById("playAgain");
	replay.addEventListener("click", function() {
		overlay.className = "hidden";
		reset(grid, undefined, MAX_MOVES);
	}, false);

	overlay.className = "";
}

function handleLoss() {
	ga('send', 'event', 'game', 'loss', 'loss');
	
	var overlay = document.getElementById("overlay");
	overlay.innerHTML = '';
	overlay.innerHTML += '<span>You lose!</span>\n';
	overlay.innerHTML += '<div id="button-wrapper">\n\t';
	overlay.innerHTML += '</div>';

	var wrapper = document.getElementById("button-wrapper");
	wrapper.innerHTML = '<a id="playAgain" href="#" class="overlay-button">Retry!</a>\n';

	var replay = document.getElementById("playAgain");
	replay.addEventListener("click", function() {
		overlay.className = "hidden";
		reset(grid, startingGrid, MAX_MOVES);
	}, false);

	overlay.className = "";
}

function handleReset() {
	var overlay = document.getElementById("overlay");
	overlay.className = "hidden";

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
if(bestScore === undefined || bestScore > MAX_MOVES-5)
	setBestScore("--");
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
grid = reset(undefined, undefined, MAX_MOVES);
