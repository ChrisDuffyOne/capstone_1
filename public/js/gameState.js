//---------- GAMESTATE DATA ----------//
var socket = io();

var roomIndex;
var context;
var queue;
var stage;
var notDead = true;
var gameLoaded = false;
var maxFOX = 30;
var maxEGG = 30;
var maxEGGpartner = 30;
var WIDTH = 1000;
var HEIGHT = 500;

var score = 0;
var scoreText;

//CharSheets
var chickenSheet;
var chickenBrSheet;
var foxSheet;
var eggSheet;

//Sprites
var playerSprite;
var partnerSprite;
var eggSprite = [];
var eggSpritePartner = [];

var foxSprite = [];
//var playerNum;

var Key = {
      _pressed: {},
      
      //fire control
      firePressed: 0,
      firePressReset: function(){
          var self = this;
          setTimeout(function(){self.firePressed = 0}, 500);
      },
      
      SPACE: 32,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
  
      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },
      
      onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
      },
      
      onKeyup: function(event) {
        delete this._pressed[event.keyCode];
      }
};