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
        {id: 'foxChar', src: 'assets/fox.png'},
        {id: 'egg', src: 'assets/egg.png'},
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
    chickenBrSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('chickenCharBr')],
        "frames": {"width": 214, "height": 241},
        "animations": {"flap": [0,0]}
    }); 
    foxSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('foxChar')],
        "frames": {"width": 284, "height": 185},
        "animations": {"walk": [0,0]}
    });
    eggSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('egg')],
        "frames": {"width": 88, "height": 80},
        "animations": {"none": [0,0]}
    });
    
    //create player
    playerSprite = new createjs.Sprite(chickenSheet, "flap");
    playerSprite.regX = 100;
    playerSprite.scaleX = 1; //DEBUG
    playerSprite.x = 100;
    playerSprite.y = 200;
    playerSprite.width = 214;
    playerSprite.height = 241;
    playerSprite.dx = 10;
    playerSprite.gotoAndPlay("flap");
    stage.addChildAt(playerSprite,1);
    
    //create partner
    partnerSprite = new createjs.Sprite(chickenBrSheet, "flap");
    partnerSprite.regX = 100;
    partnerSprite.scaleX = 1; //DEBUG
    partnerSprite.x = 425;
    partnerSprite.y = 500;
    partnerSprite.width = 214;
    partnerSprite.height = 241;
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
    updatePlayerControl();
    updateFoxMovement();
    updateEggMovement();
    updateEggPartnerMovement(); //DEBUG
    collisionProcess();
};

//------------ debug FOX KILL OTHER -------------//
function killFoxPartner(foxX, foxY){
    for(var k=0; k<maxFOX; k++) if(foxSprite[k]){
        if(foxSprite[k].x > foxX-10 && foxSprite[k].x < foxX+10){
            console.log('OTHER PLAYER KILL'); //DEBUG
            //stage.removeChild(eggSpritePartner[eggNum]);
            stage.removeChild(foxSprite[k]);
            //eggSprite.splice(eggNum, 1);
            foxSprite.splice(k, 1);
        }
    }
    //TODO make Egg disappear
    /*for(var i=0; i<maxEGGpartner; i++){
        if(eggSpritePartner[i].x > foxX-10 && eggSpritePartner[i].x <foxX+10){
            stage.removeChild(eggSpritePartner[eggNum]);
            eggSprite.splice(eggNum, 1);
        } 
    }*/
}

//----------- debug GAME INSTANCE -------------//
socket.on('gameInstance',function(gameInfo){
    if(gameLoaded){
        if(gameInfo.gameType === 'foxSpawn'){
            createFox();
        }
    }
});

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