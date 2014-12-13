function Grid (size) {
  this.size = size;
  this.tiles = [];

  this.initTiles ();
}

Grid.prototype.initTiles = function () {
  
  for (var i = 0; i < this.size * this.size; i++) {
    var x = i % this.size;
    var y = (i-x) / this.size;
    var position = {"x": x, "y": y};

    var tile = new Tile (i, position);
    tile.on = true;
    this.tiles.push(tile);
  }

};

Grid.prototype.inBounds = function (position) {
  if (position.x < 0) return false;
  if (position.y < 0) return false;
  if (position.x >= this.size) return false;
  if (position.y >= this.size) return false;
  return true;
};

Grid.prototype.getTile = function (position) {
  
  if (!this.inBounds (position)) return null;

  var id = (this.size * position.y) + position.x;
  return this.tiles[id];

};

Grid.prototype.toggleTile = function (tileID) {

  var tile = this.tiles[tileID];

  for (var dx = -1; dx <= 1; dx++) {
    for (var dy = -1; dy <= 1; dy++) {
     
      if (Math.abs(dx) + Math.abs(dy) == 2) continue;

      var x = tile.position.x + dx;
      var y = tile.position.y + dy;
      var position = {"x": x, "y": y};
      var thisTile = this.getTile (position);

      if (!thisTile) continue;

      this.tiles[thisTile.id].on = !this.tiles[thisTile.id].on;
    }
  }

};

Grid.prototype.generateStartingBoard = function (difficulty) {

  for (var i = 0; i < difficulty; i++) {
    var id = this.getRandomTile().id;
    this.toggleTile (id);
  }

};

Grid.prototype.getRandomTile = function () {
  var id = Math.floor(Math.random() * this.size * this.size);
  return this.tiles[id];
};
