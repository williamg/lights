function GameInstance () {

  this.grid = new Grid (5);
  this.renderer = new Renderer ();
  this.inputHandler = new InputHandler ();

  this.inputHandler.connect ("tileClick", this.handleTileClick.bind (this));

  this.grid.generateStartingBoard (50);
  this.renderer.render (this.grid);
}

GameInstance.prototype.handleTileClick = function (data) {
  var tileID = data.tileID;
  this.grid.toggleTile (tileID);
  this.renderer.render.bind (this.renderer, this.grid);

  // Check for a win, out of moves, etc.
};
