//---------- GAMESTATE DATA ----------//
var socket = io();

var roomIndex;
var context;
var queue;
var stage;
var gameLoaded = false;
var maxFOX = 30; //DEBUG
var maxEGG = 30; //DEBUG
var WIDTH = 1000;
var HEIGHT = 500;

//charSheets
var chickenSheet;
var chickenBrSheet;
var foxSheet;
var eggSheet; //DEBUG

//Sprites
var playerSprite;
var partnerSprite;
var eggSprite = []; //DEBUG

var foxSprite = [];
//var playerNum; //DEBUG

var Key = {
      _pressed: {},
      
      //DEBUG
      firePressed: 0,
      firePressReset: function(){
          var self = this;
          setTimeout(function(){self.firePressed = 0}, 2000);
      },
      
      SPACE: 32, //DEBUG
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

//DEBUG Score Data    
var DEBUG_SCORES = {
    "scores":[
        {
            "playerHandle" : "Obama",
            "score": "72"
        },
        {
            "playerHandle" : "Biden",
            "score": "54"
        },
        {
            "playerHandle" : "Trump",
            "score": "107"
        },
        {
            "playerHandle" : "Hillary",
            "score": "98"
        }
    ]
}