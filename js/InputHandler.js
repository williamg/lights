function InputHandler () {

  this.eventLinks = {};
  this.init ();

}

InputHandler.prototype.init = function () {
  
  var tileDivs = document.getElementsByClassName ('tile');
  var self = this;

  for (var i = 0; i < tileDivs.length; i++) {
    var tileDiv = tileDivs[i];
    var id = parseInt (tileDiv.id.substring (1));
    var data = {"tileID": id};
    tileDiv.addEventListener ('click', self.trigger.bind(self, 'tileClick', data));
  }

};

InputHandler.prototype.connect = function (event, callback) {
  
  if (!this.eventLinks.event) this.eventLinks.event = [];
  this.eventLinks.event.push (callback); 
};

InputHandler.prototype.trigger = function (event, data) {
  if (!this.eventLinks.event) return;

  var callbacks = this.eventLinks.event;
  
  callbacks.forEach (function (callback) {
    callback (data);
  });

};
