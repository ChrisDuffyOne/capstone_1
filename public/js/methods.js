//----------------------------------//
//		     GAME METHODS           //
//----------------------------------//

//----------- CREATE QUEUE -------------//
function createQueue(){
    queue = new createjs.LoadQueue(false);
    queue.on("complete", queueLoaded, this);
    queue.loadManifest([
        {id: 'chickenChar', src: 'assets/chickenLt.png'},
        {id: 'chickenCharBr', src: 'assets/chickenBrLt.png'},
        {id: 'foxChar', src: 'assets/foxLt.png'},
        {id: 'egg', src: 'assets/eggLt.png'},
        {id: 'barnScreen', src: 'assets/barnCoolBack.png'}
    ]);
    queue.load();
}

//----------- QUEUE LOADED -------------//
function queueLoaded(event){
    var greenFPO = new createjs.Bitmap(queue.getResult("barnScreen"));
    stage.addChild(greenFPO);
    
    //DEBUG score area
    //scoreText = new createjs.Text("SCORE: " + score.toString(), "36px Arial", "#FFF");
    scoreText = new createjs.Text("SCORE: " + score.toString(), "50px Pixel", "#FFF");
    scoreText.x = 10;
    scoreText.y = -20;
    stage.addChild(scoreText);
    
    chickenSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('chickenChar')],
        "frames": {"width": 107, "height": 122},
        "animations": {"flap": [0,0]}
    });
    chickenBrSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('chickenCharBr')],
        "frames": {"width": 107, "height": 122},
        "animations": {"flap": [0,0]}
    }); 
    foxSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('foxChar')],
        "frames": {"width": 140, "height": 91},
        "animations": {"walk": [0,0]}
    });
    eggSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('egg')],
        "frames": {"width": 44, "height": 40},
        "animations": {"none": [0,0]}
    });
    
    //create player
    playerSprite = new createjs.Sprite(chickenSheet, "flap");
    playerSprite.regX = 53;
    playerSprite.scaleX = 1;
    playerSprite.x = 500;
    playerSprite.y = 260;
    playerSprite.width = 107;
    playerSprite.height = 122;
    playerSprite.dx = 10;
    playerSprite.gotoAndPlay("flap");
    stage.addChildAt(playerSprite,1);
    
    //create partner
    partnerSprite = new createjs.Sprite(chickenBrSheet, "flap");
    partnerSprite.regX = 53;
    partnerSprite.scaleX = 1;
    partnerSprite.x = 425;
    partnerSprite.y = 500;
    partnerSprite.width = 107;
    partnerSprite.height = 122;
    partnerSprite.gotoAndPlay("flap");
    stage.addChildAt(partnerSprite,1);

    //tick event setup
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', processEvents);
    
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
    
    gameLoaded = true;
}

//----------- PROCESS EVENTS -------------//
function processEvents(){
    if(notDead){
        updatePlayerControl();
        updateFoxMovement();
        updateEggMovement();
        updateEggPartnerMovement();
        collisionProcess();
    }
};

//------------ debug FOX KILL OTHER -------------//
function killFoxPartner(foxX, foxY, eggX, eggY){
    for(var k=0; k<maxFOX; k++) if(foxSprite[k]){
        if(foxSprite[k].x >= foxX-10 && foxSprite[k].x <= foxX+10){
            console.log('OTHER PLAYER KILL');
            stage.removeChild(foxSprite[k]);
            foxSprite.splice(k, 1);
        }
    }
    for(var i=0; i<maxEGGpartner; i++) if(eggSpritePartner[i]){
        if(eggSpritePartner[i].x >= eggX-30 && eggSpritePartner[i].x <= eggX+30){
            stage.removeChild(eggSpritePartner[i]);
            eggSprite.splice(i, 1);
        }
    }
}

//----------- GAME INSTANCE -------------//
/*socket.on('gameInstance',function(gameInfo){
    if(gameLoaded){
        if(gameInfo.gameType === 'foxSpawn'){
            console.log('Client direction:',gameInfo.direction);//DEBUG
            console.log('Client speed :',gameInfo.speed);//DEBUG
            //createFox();
            createFox(gameInfo.direction, gameInfo.speed);
        }
    }
});*/

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