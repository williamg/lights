function Renderer () {

  this.tileArrayBeingRendered = [];
  this.animationID = null;
  
  this.offColor = {"r": 14, "g": 23, "b": 37};
  this.glowColor = {"r": 255, "g": 255, "b": 255, "a": 0.5}; 
  this.onColor = {"r": 255, "g": 255, "b": 255}; 

}

Renderer.prototype.render = function (grid) {

  if (this.animationID) {
    if(this.equalTileArrays(this.tileArrayBeingRendered, grid.tiles)) {
      cancelAnimationFrame (this.animationID);
    }
  }
  
  this.tileArrayBeingRendered = grid.tiles;
  this.animationID = requestAnimationFrame (this.animate.bind(this));

};

Renderer.prototype.equalTileArrays = function (a, b) {
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; i++) {
    if (a[i].on != b[i].on) return false;
  }

  return true;
};

Renderer.prototype.animate = function () {

  var tileDivs = document.getElementsByClassName ('tile');

  for (var i = 0; i < tileDivs.length; i++) {
    var tileDiv = tileDivs[i];
    var idVal = parseInt (tileDiv.id.substring (1));

    var style = window.getComputedStyle (tileDiv);
    var color = style.getPropertyValue ("background-color");
    color = this.getRGB (color);

    var boxShadow = style.getPropertyValue ("box-shadow");
    boxShadow = this.getBoxShadowColor (boxShadow);

    var speed = 30;
    var r, g, b, a;

    if (this.tileArrayBeingRendered[idVal].on) {
     
      // Background color
      r = Math.min (this.onColor.r, color.r + speed);
      g = Math.min (this.onColor.g, color.g + speed);
      b = Math.min (this.onColor.b, color.b + speed);

      // Glow color
      a = Math.min (0.5, boxShadow.a + 0.1*speed);
      tileDiv.style.zIndex = 100;

    } else {
      
      r = Math.max (this.offColor.r, color.r - speed);
      g = Math.max (this.offColor.g, color.g - speed);
      b = Math.max (this.offColor.b, color.b - speed);
    
      a = Math.max (0.0, boxShadow.a - 0.1 * speed);
      tileDiv.style.zIndex = 0;
    }
    
    
    tileDiv.style.backgroundColor = this.toString (r, g, b);
    tileDiv.style.boxShadow = this.toBoxShadowString (255, 255, 255, a); 
  } 

  this.animationID = requestAnimationFrame (this.animate.bind(this));
};

Renderer.prototype.getRGB = function (rgbString) {

  // rgb(x, y, z) => {x, y, z}
  var numList = rgbString.substr (4);
  numList = numList.substr(0, numList.length-1);
  var numArray = numList.split (", ");
  return {  "r": parseInt(numArray[0]), 
            "g": parseInt(numArray[1]),
            "b": parseInt(numArray[2])};

};

Renderer.prototype.toString = function (r, g, b) {
  return "rgb(" + r + ", " + g + ", " + b + ")";
};

Renderer.prototype.getBoxShadowColor = function (boxShadowString) {
  if (boxShadowString == "none") {
    return {"r": 255, "g": 255, "b": 255, "a": 0.0};
  }
  
  var numList = boxShadowString.substr (5);
  numList = numList.substr(0, numList.indexOf (")"));
  var numArray = numList.split (", ");
  return {  "r": parseInt(numArray[0]),
            "g": parseInt(numArray[1]),
            "b": parseInt(numArray[2]),
            "a": parseFloat(numArray[3])};
};

Renderer.prototype.toBoxShadowString = function (r, g, b, a) {
  return "0px 0px 10px rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
};
