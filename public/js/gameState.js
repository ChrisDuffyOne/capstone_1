//Gamestate Data
var context;
var queue;
var stage;
var chickenSheet;
var chickenSprite;

var Key = {
      _pressed: {},

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