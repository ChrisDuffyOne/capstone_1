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
    //DEBUG
    eggSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('egg')],
        "frames": {"width": 88, "height": 80},
        "animations": {"none": [0,0]}
    });
    
    //create player
    playerSprite = new createjs.Sprite(chickenSheet, "flap");
    playerSprite.regX = 100; //DEBUG
    playerSprite.x = 100;
    playerSprite.y = 200;
    playerSprite.width = 214;
    playerSprite.height = 241;
    playerSprite.dx = 10;
    playerSprite.gotoAndPlay("flap");
    stage.addChildAt(playerSprite,1);
    
    //create partner
    partnerSprite = new createjs.Sprite(chickenBrSheet, "flap");
    partnerSprite.x = 425;
    partnerSprite.y = 500;
    partnerSprite.gotoAndPlay("flap");
    stage.addChildAt(partnerSprite,1);
    
    //TEST eggDetect
    eggSprite[0] = new createjs.Sprite(eggSheet, "none"); 
    eggSprite[0].regX = 44;
    eggSprite[0].x = 200;
    eggSprite[0].y = 400;
    eggSprite[0].width = 88;
    eggSprite[0].height = 80;
    eggSprite[0].dx = 0;
    eggSprite[0].gotoAndPlay("none");
    stage.addChildAt(eggSprite[0],1);

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
    updateEggMovement(); //DEBUG
    collisionProcess(); //DEBUG
};

//----------- UPDATE MOVEMENT -------------//
function updatePlayerControl(){
    
    //this player movement
    if (Key.isDown(Key.UP)){
        playerSprite.y -= playerSprite.dx;
        socket.emit('playerPos',{room: roomIndex, x: playerSprite.x, y:playerSprite.y});
    };
    if (Key.isDown(Key.LEFT)){
        //playerSprite.scaleX = -1; //DEBUG
        playerSprite.x -= playerSprite.dx;
        socket.emit('playerPos',{room: roomIndex, x: playerSprite.x, y:playerSprite.y});
    };
    if (Key.isDown(Key.DOWN)){
        playerSprite.y += playerSprite.dx;
        socket.emit('playerPos',{room: roomIndex, x: playerSprite.x, y:playerSprite.y});
    };
    if (Key.isDown(Key.RIGHT)){
        //playerSprite.scaleX = 1; //DEBUG
        playerSprite.x += playerSprite.dx;
        socket.emit('playerPos',{room: roomIndex, x: playerSprite.x, y:playerSprite.y});
    };
    
    //this player fire
    if (Key.isDown(Key.SPACE) && Key.firePressed === 0){
        Key.firePressed = 1;
        Key.firePressReset();
        createEgg(playerSprite.x, playerSprite.y, playerSprite.scaleX); //DEBUG
    };
};

//----------- debug FOX MOVEMENT -------------//
function updateFoxMovement(){
    for(var i=0; i<maxFOX; i++) if(foxSprite[i]){
        if(foxSprite[i].scaleX === -1){
            foxSprite[i].x -= foxSprite[i].dx;
        }else{
            foxSprite[i].x += foxSprite[i].dx;
        }
        
        if(foxSprite[i].x < -20 || foxSprite[i].x > WIDTH+20){ //-20
            stage.removeChild(foxSprite[i]);
            foxSprite.splice(i, 1);
        }
    }
}

//----------- debug FOX SPAWN -------------//
function createFox(){
    var found = -1;
    
    for(var i=0; i<maxFOX; i++){
       if(foxSprite[i] === undefined){
           found = i;
           break;
       } 
    }
    
    if(found >= 0){
        foxSprite[found] = new createjs.Sprite(foxSheet, "walk"); 
        foxSprite[found].x = WIDTH+10;
        foxSprite[found].y = 200;
        foxSprite[found].dx = 1;
        foxSprite[found].scaleX = -1;
        foxSprite[found].gotoAndPlay("walk");
        stage.addChildAt(foxSprite[found],1);
    }
}

//----------- debug EGG MOVEMENT -------------//
function updateEggMovement(){
    for(var i=0; i<maxEGG; i++) if(eggSprite[i]){
        if(eggSprite[i].scaleX === -1){
            eggSprite[i].x -= eggSprite[i].dx;
        }else{
            eggSprite[i].x += eggSprite[i].dx;
        }
        
        if(eggSprite[i].x < -20 || eggSprite[i].x > WIDTH+20){ 
            stage.removeChild(eggSprite[i]);
            eggSprite.splice(i, 1);
        }
    }
}

//----------- debug EGG SPAWN -------------//
function createEgg(playerX, playerY, playerScaleX){
    var found = -1;
    
    for(var i=0; i<maxEGG; i++){
       if(eggSprite[i] === undefined){
           found = i;
           break;
       } 
    }
    
    if(found >= 0){
        eggSprite[found] = new createjs.Sprite(eggSheet, "none"); 
        eggSprite[found].x = playerX;
        eggSprite[found].y = playerY;
        eggSprite[found].dx = 3;
        if(playerScaleX === -1){
            eggSprite[found].scaleX = -1;
        }else{
            eggSprite[found].scaleX = 1;
        }
        eggSprite[found].gotoAndPlay("none");
        stage.addChildAt(eggSprite[found],1);
    }
}

//----------- debug COLLISION DETECT -------------//
function collisionProcess(){
    
    //DEBUG egg/fox collide
    for(var i=0; i<maxEGG; i++) if(eggSprite[i]){
        for(var k=0; k<maxFOX; k++) if(foxSprite[k]){
            if(collide2d(eggSprite[i].x, eggSprite[i].y, foxSprite[k].x, foxSprite[k].y, 88, 80, 284, 185)){
                console.log('FOX EGG COLLIDE'); //DEBUG
            };
        }
    }
    
    //TEST chicken/egg collide
    //if(collide2d(eggSprite[0].x, eggSprite[0].y, playerSprite.x, playerSprite.y, 88, 80, 214, 241)){
    /*if(collide2dOffset(eggSprite[0].x, eggSprite[0].y, playerSprite.x, playerSprite.y, 88, 80, 214, 241)){
        console.log('TEST COLLIDE OFFSET'); //DEBUG
    };*/
    
    
    if(collide2dEasel(eggSprite[0], playerSprite)){
        console.log('EASEL COLLIDE REGX Factored');
    };
}

//----------- debug GAME INSTANCE -------------//
socket.on('gameInstance',function(gameInfo){
    if(gameLoaded){
        if(gameInfo.gameType === 'foxSpawn'){
            createFox();
        }
    }
});

//----------- COLLISION DETECT -------------//
function collide2d(x1, y1, x2, y2, wt1, ht1, wt2, ht2){
    return (!((x1 > (x2+wt2)) || (x2 > (x1+wt1)) || (y1 > (y2+ht2)) || (y2 > (y1+ht1))));
};

//----------- COLLISION DETECT NEW -------------//
/*function collide2dOffset(x1, y1, x2, y2, wt1, ht1, wt2, ht2){
    x2 = x2 - wt2/2; //WORKS!
    return (!((x1 > (x2+wt2)) || (x2 > (x1+wt1)) || (y1 > (y2+ht2)) || (y2 > (y1+ht1))));
};*/
function collide2dEasel(sprite1, sprite2){
    var x1 = sprite1.x,
        y1 = sprite1.y,
        wt1 = sprite1.width,
        ht1 = sprite1.height,
        x2 = sprite2.x,
        y2 = sprite2.y,
        wt2 = sprite2.width,
        ht2 = sprite2.height;
    
    //error check
    if((sprite1.width || sprite1.height) === undefined){
        console.log('ERROR no height/width sprite1');
    }
    if((sprite2.width || sprite2.height) === undefined){
        console.log('ERROR no height/width sprite2');
    }
    
    //factor in regX
    /*Assumes .regx is placed in the center of the sprite*/
    if(sprite1.regX != 0) x1 = x1 - wt1/2;
    if(sprite2.regX != 0) x2 = x2 - wt2/2;
    
    return (!((x1 > (x2+wt2)) || (x2 > (x1+wt1)) || (y1 > (y2+ht2)) || (y2 > (y1+ht1))));
}

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