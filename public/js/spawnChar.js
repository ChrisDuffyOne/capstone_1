//----------------------------------//
//		  SPAWN CHARACTER JS	    //
//----------------------------------//

function createFox(comeFromSide, speed, height){
    var found = -1;
    
    for(var i=0; i<maxFOX; i++){
       if(foxSprite[i] === undefined){
           found = i;
           break;
       } 
    }
    
    if(found >= 0){
        foxSprite[found] = new createjs.Sprite(foxSheet, "walk"); 
        foxSprite[found].regX = 70;
        foxSprite[found].width = 140;
        foxSprite[found].height = 91;
        
        if(comeFromSide.toLowerCase() === 'left'){
            foxSprite[found].x = -10;
            foxSprite[found].y = height;
            foxSprite[found].dx = speed;
            foxSprite[found].scaleX = 1;
        }
        if(comeFromSide.toLowerCase() === 'right'){
            foxSprite[found].x = WIDTH+10;
            foxSprite[found].y = height;
            foxSprite[found].dx = speed;
            foxSprite[found].scaleX = -1;
        }
        
        foxSprite[found].gotoAndPlay("walk");
        stage.addChildAt(foxSprite[found],1);
    }
}

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
        eggSprite[found].regX = 22;
        eggSprite[found].x = playerX;
        eggSprite[found].y = playerY;
        eggSprite[found].width = 44;
        eggSprite[found].height = 40;
        eggSprite[found].dx = 12; //3
        if(playerScaleX === -1){
            eggSprite[found].scaleX = -1;
        }else{
            eggSprite[found].scaleX = 1;
        }
        eggSprite[found].gotoAndPlay("none");
        stage.addChildAt(eggSprite[found],1);
    }
}

function createEggPartner(playerX, playerY, playerScaleX){
    var found = -1;
    
    for(var i=0; i<maxEGGpartner; i++){
       if(eggSpritePartner[i] === undefined){
           found = i;
           break;
       } 
    }
    
    if(found >= 0){
        eggSpritePartner[found] = new createjs.Sprite(eggSheet, "none");
        eggSpritePartner[found].regX = 44;
        eggSpritePartner[found].x = playerX;
        eggSpritePartner[found].y = playerY;
        eggSpritePartner[found].width = 88;
        eggSpritePartner[found].height = 80;
        eggSpritePartner[found].dx = 12;
        if(playerScaleX === -1){
            eggSpritePartner[found].scaleX = -1;
        }else{
            eggSpritePartner[found].scaleX = 1;
        }
        eggSpritePartner[found].gotoAndPlay("none");
        stage.addChildAt(eggSpritePartner[found],1);
    }
}