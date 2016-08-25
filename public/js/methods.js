//----------------------------------//
//		     GAME METHODS           //
//----------------------------------//

//----------- CREATE QUEUE -------------//
function createQueue(){
    queue = new createjs.LoadQueue(false);
    queue.on("complete", queueLoaded, this);
    queue.loadManifest([
        {id: 'chickenChar', src: 'assets/chicken.png'},
        {id: 'chickenCharBr', src: 'assets/chickenBr.png'},
        {id: 'greenScreen', src: 'assets/greenScreen.jpg'}
    ]);
    queue.load();
}

//----------- QUEUE LOADED -------------//
function queueLoaded(event){
    var greenFPO = new createjs.Bitmap(queue.getResult("greenScreen"));
    stage.addChild(greenFPO);
    
    chickenSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('chickenChar')],
        "frames": {"width": 214, "height": 241},
        "animations": {"flap": [0,0]}
    });
    createChicken();

    //tick event setup
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', processEvents);
    
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
}


//----------- CREATE CHICKEN -------------//
function createChicken(){
    chickenSprite = new createjs.Sprite(chickenSheet, "flap");
    chickenSprite.x = 100;
    chickenSprite.y = 200;
    chickenSprite.gotoAndPlay("flap");
    stage.addChildAt(chickenSprite,1);
}

//----------- PROCESS EVENTS -------------//
function processEvents(){
    updateMovement();
};

//----------- UPDATE MOVEMENT -------------//
function updateMovement(){
    //this player movement
    if (Key.isDown(Key.UP)){
        chickenSprite.y--;
        socket.emit('chickenPos',{x: chickenSprite.x, y:chickenSprite.y});
    };
    if (Key.isDown(Key.LEFT)){ 
        chickenSprite.x--;
        socket.emit('chickenPos',{x: chickenSprite.x, y:chickenSprite.y});
    };
    if (Key.isDown(Key.DOWN)){
        chickenSprite.y++;
        socket.emit('chickenPos',{x: chickenSprite.x, y:chickenSprite.y});
    };
    if (Key.isDown(Key.RIGHT)){ 
        chickenSprite.x++;
        socket.emit('chickenPos',{x: chickenSprite.x, y:chickenSprite.y});
    };
    
    //DEBUG other player movement
    /*socket.on('chickenMov', function(coords){
		chickenSprite.x = coords.x;
		chickenSprite.y = coords.y;
	});*/
};

//----------- COLLISION DETECT -------------//
function collide2d(x1, y1, x2, y2, wt1, ht1, wt2, ht2){
    return (!((x1 > (x2+wt2)) || (x2 > (x1+wt1)) || (y1 > (y2+ht2)) || (y2 > (y1+ht1))));
};

//----------------------------------//
//		    SCORE METHODS           //
//----------------------------------//
//!\CHANGEfORfINAL
function getScores(callbackFunc){
    setTimeout(function(){callbackFunc(DEBUG_SCORES)}, 2000);
}

function displayHighScores(data){
    for(index in data.scores){
        $('#scoreList').append(
            '<li class="scoreItem"><span>'+data.scores[index].playerHandle+'</span><span>'+data.scores[index].score+'</span></li>');
    }
}

function getAndDisplayScore(){
    getScores(displayHighScores);
}