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

//----------------------------------//
//		 ARCADE APP FUNCTION	    //
//----------------------------------//
function arcade(){
    var socket = io();
    
    //room select
    //---------------------------------
    $('.roomSelect li').on('click', function(){
       var room = "room";
       var index = $(this).index();
       var roomIndex = room.concat(index);
       socket.emit('roomSelect', roomIndex);
       $('.roomSelect').css('display','none');
    });
	
	//create.js
	//---------------------------------
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = 400;
    context.canvas.height = 400;
    stage = new createjs.Stage("myCanvas");
    
    //asset cue
    queue = new createjs.LoadQueue(false);
    queue.on("complete", queueLoaded, this);
    queue.loadManifest([
        {id: 'chickenChar', src: 'assets/chicken.png'},
        {id: 'greenScreen', src: 'assets/greenScreen.jpg'}
    ]);
    queue.load();
}

//----------------------------------//
//		    LOAD QUEUE         	    //
//----------------------------------//
function queueLoaded(event){
    var greenFPO = new createjs.Bitmap(queue.getResult("greenScreen"));
    stage.addChild(greenFPO);
    
    chickenSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('chickenChar')],
        "frames": {"width": 214, "height": 241},
        "animations": {"flap": [0,0]}
    });
    createChicken();

    
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);
    
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
}

//----------------------------------//
//		   CREATE CHICKEN           //
//----------------------------------//
function createChicken(){
    chickenSprite = new createjs.Sprite(chickenSheet, "flap");
    chickenSprite.x = 100;
    chickenSprite.y = 200;
    chickenSprite.gotoAndPlay("flap");
    stage.addChildAt(chickenSprite,1);
}

//----------------------------------//
//		      TICK EVENT            //
//----------------------------------//
function tickEvent(){
    if (Key.isDown(Key.UP)) chickenSprite.y--;
    if (Key.isDown(Key.LEFT)) chickenSprite.x--;
    if (Key.isDown(Key.DOWN)) chickenSprite.y++;
    if (Key.isDown(Key.RIGHT)) chickenSprite.x++;
};

//----------------------------------//
//		     DOCUMENT READY	        //
//----------------------------------//
$(document).ready(function(){
    arcade();
});