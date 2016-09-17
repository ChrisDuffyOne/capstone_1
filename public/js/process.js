//moveChar.js

function updatePlayerControl(){
    
    //this player movement
    if (Key.isDown(Key.UP)){
        //console.log('playerSprite.y:',playerSprite.y); //DEBUG
        playerSprite.y -= playerSprite.dx;
        socket.emit('playerComm',{commType: 'playerPos', room: roomIndex, x: playerSprite.x, y:playerSprite.y});
    };
    if (Key.isDown(Key.LEFT)){
        //console.log('playerSprite.x:',playerSprite.x); //DEBUG
        playerSprite.scaleX = -1;
        playerSprite.x -= playerSprite.dx;
        socket.emit('playerComm',{commType: 'playerPos', room: roomIndex, x: playerSprite.x, y:playerSprite.y});
    };
    if (Key.isDown(Key.DOWN)){
        //console.log('playerSprite.y:',playerSprite.y); //DEBUG
        playerSprite.y += playerSprite.dx;
        socket.emit('playerComm',{commType: 'playerPos', room: roomIndex, x: playerSprite.x, y:playerSprite.y});
    };
    if (Key.isDown(Key.RIGHT)){
        //console.log('playerSprite.x:',playerSprite.x); //DEBUG
        playerSprite.scaleX = 1;
        playerSprite.x += playerSprite.dx;
        socket.emit('playerComm',{commType: 'playerPos', room: roomIndex, x: playerSprite.x, y:playerSprite.y});
    };
    
    //this player fire
    if (Key.isDown(Key.SPACE) && Key.firePressed === 0){
        Key.firePressed = 1;
        Key.firePressReset();
        createEgg(playerSprite.x, playerSprite.y, playerSprite.scaleX);
        
        socket.emit('playerComm',{commType: 'eggFire', room: roomIndex, x: playerSprite.x, y:playerSprite.y, scaleX: playerSprite.scaleX});
    };
};

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

function updateEggPartnerMovement(){
    for(var i=0; i<maxEGGpartner; i++) if(eggSpritePartner[i]){
        if(eggSpritePartner[i].scaleX === -1){
            eggSpritePartner[i].x -= eggSpritePartner[i].dx;
        }else{
            eggSpritePartner[i].x += eggSpritePartner[i].dx;
        }
        
        if(eggSpritePartner[i].x < -20 || eggSpritePartner[i].x > WIDTH+20){ 
            stage.removeChild(eggSpritePartner[i]);
            eggSpritePartner.splice(i, 1);
        }
    }
}


//----------------------------------//
//		   COLLISION DETECT         //
//----------------------------------//
function collisionProcess(){
    
    //egg/fox collide
    for(var i=0; i<maxEGG; i++) if(eggSprite[i]){
        for(var k=0; k<maxFOX; k++) if(foxSprite[k]){
            if(collide2dEasel(eggSprite[i], foxSprite[k])){
                socket.emit('playerComm',{commType: 'foxDeath', room: roomIndex, foxX: foxSprite[k].x, foxY: foxSprite[k].y, eggX: eggSprite[i].x, eggY: eggSprite[i].y}); //DEBUG
                
                score++;
                scoreText.text = "SCORE: " + score.toString();
                stage.removeChild(eggSprite[i]);
                stage.removeChild(foxSprite[k]);
                eggSprite.splice(i, 1);
                foxSprite.splice(k, 1);
                break;
            }
        }
    }
    
    //fox/player collide
    for(var r=0; r<maxFOX; r++) if(foxSprite[r]){
        if(collide2dEasel(foxSprite[r], playerSprite)){
            //DEBUG stop process
            notDead = false; //DEBUG
            
            //display score box
            $('#playerScore').html(score);
            var localName = localStorage.getItem('playerNameLocal');
            if(localName != undefined){ $('#playerName').val(localName)}
            else{ $('#playerName').val('Player Name')}
            $('#scoreSubmit').css("display", "initial");
        }
    }
    
    //DEBUG player screen contain
    if(playerSprite.y <= 220){playerSprite.y = 220};
    if(playerSprite.y >= 380){playerSprite.y = 380};
    if(playerSprite.x <= 60){playerSprite.x = 60};
    if(playerSprite.x >= 940){playerSprite.x = 940};
    
    //testEgg
    /*if(collide2dEasel(eggSprite[0], playerSprite)){
        console.log('EASEL COLLIDE REGX Factored');
    };*/
}

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